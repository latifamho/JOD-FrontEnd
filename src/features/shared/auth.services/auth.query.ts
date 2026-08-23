"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { API_SUCCESS_MESSAGES } from "@/constant/api-success-messages";
import {
  AuthFlowError,
  getAuthenticatedLanding,
  isAccountTypeCompatible,
} from "@/features/shared/auth.services/auth.utils";
import {
  clearAuthData,
  setAuthTokens,
} from "@/lib/cookies";
import { toast } from "@/lib/toast";
import { mediaServices } from "@/features/shared/media/media.services";
import { useAuth } from "@/providers/AuthProvider";
import { authServices } from "./auth.service";
import type {
  CompanyRegisterRequest,
  DashboardContextData,
  DashboardRole,
  LoginAccountType,
  LoginMutationInput,
  LoginResponse,
} from "./auth.type";

async function completeAuthentication(
  response: LoginResponse,
  accountType: LoginAccountType,
  ownerOnly = false,
): Promise<{ context: DashboardContextData; role: DashboardRole }> {
  setAuthTokens(response.data);

  try {
    const contextResponse = await authServices.getDashboardContext();
    const context = contextResponse.data;
    const role = context.profile.dashboardRole;

    if (!role) {
      throw new AuthFlowError("هذا الحساب لا يملك صلاحية الوصول إلى لوحة التحكم.");
    }

    if (!isAccountTypeCompatible(accountType, role)) {
      throw new AuthFlowError(
        accountType === "admin"
          ? "هذا الحساب ليس حساب إدارة منصة. اختر حساب منظمة وحاول مرة أخرى."
          : "هذا الحساب ليس مرتبطاً بمنظمة. اختر حساب إدارة المنصة وحاول مرة أخرى.",
      );
    }

    if (ownerOnly && role !== "org_owner") {
      throw new AuthFlowError("تعذّر تهيئة حساب مالك المنظمة بعد التسجيل.");
    }

    return { context, role };
  } catch (error) {
    clearAuthData();
    throw error;
  }
}

function useCompleteAuthSession() {
  const router = useRouter();
  const { login, setDashboardContext } = useAuth();

  return (context: DashboardContextData, successMessage: string) => {
    setDashboardContext(context);
    login();
    toast.success(successMessage);
    router.replace(getAuthenticatedLanding(context));
  };
}

export function useLogin() {
  const completeSession = useCompleteAuthSession();

  return useMutation({
    mutationFn: async ({ accountType, email, password }: LoginMutationInput) => {
      const userType = accountType === "admin" ? "admin" : "companies";
      const response = await authServices.login({ email, password, userType });
      return completeAuthentication(response, accountType);
    },
    onSuccess: ({ context }) => {
      completeSession(context, API_SUCCESS_MESSAGES.loginSuccess);
    },
  });
}

export function useRegisterOrganization() {
  const completeSession = useCompleteAuthSession();

  return useMutation({
    mutationFn: async ({ data, logoFile }: { data: CompanyRegisterRequest; logoFile?: File }) => {
      const response = await authServices.registerOrganization(data);
      setAuthTokens(response.data);

      const organizationId = response.data.user.organizationId;
      if (logoFile && organizationId) {
        try {
          await mediaServices.upload(
            { model: "organization", modelId: organizationId, prop: "logo" },
            logoFile,
          );
        } catch {
          toast.error(`تم إنشاء حساب المنظمة، لكن تعذر رفع الشعار ${logoFile.name}. يمكنك رفعه لاحقاً من الإعدادات.`);
        }
      }

      return completeAuthentication(response, "organization", true);
    },
    onSuccess: ({ context }) => {
      completeSession(context, "تم استلام طلب تسجيل منظمتك بنجاح.");
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => authServices.logout(),
    onSettled: () => {
      logout();
    },
  });
}
