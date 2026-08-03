import { api } from "@/services/api";
import { END_POINTS } from "@/features/shared/query-apis";
import type {
  CompanyRegisterRequest,
  CompanyRegisterResponse,
  DashboardContextResponse,
  LoginAccountType,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "./auth.type";

export const authServices = {
  async login(
    data: LoginRequest,
    accountType: LoginAccountType,
  ): Promise<LoginResponse> {
    const endpoint =
      accountType === "admin"
        ? END_POINTS.AUTH.LOGIN
        : END_POINTS.COMPANY_AUTH.LOGIN;
    const response = await api.post<LoginResponse>(endpoint, data, {
      skipSuccessToast: true,
      skipErrorToast: true,
    });
    return response.data;
  },

  async registerOrganization(
    data: CompanyRegisterRequest,
  ): Promise<CompanyRegisterResponse> {
    const response = await api.post<CompanyRegisterResponse>(
      END_POINTS.COMPANY_AUTH.REGISTER,
      data,
      {
        skipSuccessToast: true,
        skipErrorToast: true,
      },
    );
    return response.data;
  },

  async refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(END_POINTS.AUTH.REFRESH, data, {
      skipSuccessToast: true,
      skipErrorToast: true,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post(END_POINTS.AUTH.LOGOUT, undefined, { skipSuccessToast: true });
  },

  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>(END_POINTS.ME.PROFILE);
    return response.data;
  },

  async getDashboardContext(): Promise<DashboardContextResponse> {
    const response = await api.get<DashboardContextResponse>(
      END_POINTS.ME.DASHBOARD_CONTEXT,
    );
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await api.patch<UpdateProfileResponse>("/me/profile", data, {
      successMessageKey: "updated",
    });
    return response.data;
  },
};
