import axios, { type AxiosError } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { API_ERROR_MESSAGES } from "@/constant/api-error-messages";
import type { ApiError } from "@/types/api.types";

export type ApiFieldErrors<TField extends string = string> = Partial<Record<TField, string>>;

export interface NormalizedApiError<TField extends string = string> {
  status: number | null;
  message: string;
  fieldErrors: ApiFieldErrors<TField>;
}

type Options = { isLogin?: boolean; fieldAliases?: Record<string, string> };

const labels: Record<string, string> = {
  name: "الاسم", email: "البريد الإلكتروني", phone: "رقم الهاتف",
  password: "كلمة المرور", passwordConfirmation: "تأكيد كلمة المرور",
  title: "العنوان", body: "المحتوى", description: "الوصف", excerpt: "الملخص",
  slug: "الرابط المختصر", authorName: "اسم الكاتب", status: "الحالة",
  target: "النوع", category: "التصنيف", categoryId: "التصنيف", recipientScope: "نوع المستلم",
  recipientLabel: "اسم المستلم", criteria: "المعايير", iconName: "الأيقونة",
  isActive: "الحالة", siteName: "اسم المنصة", location: "الموقع",
  verificationStatus: "حالة التوثيق", role: "الدور",
};

const aliases: Record<string, string> = {
  password_confirmation: "passwordConfirmation", newPassword: "newPassword", new_password: "newPassword",
  newPassword_confirmation: "newPasswordConfirmation", new_password_confirmation: "newPasswordConfirmation",
  author_name: "authorName",
  recipient_scope: "recipientScope", recipient_label: "recipientLabel",
  icon_name: "iconName", is_active: "isActive", site_name: "siteName",
  allow_new_posts: "allowNewPosts", require_post_review: "requirePostReview",
  verification_status: "verificationStatus", user_type: "role",
};

const camel = (value: string) => value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

function translate(field: string, messages: string[]): string {
  const label = labels[field] ?? "الحقل";
  const source = messages.join(" ").toLowerCase();
  if (source.includes("required")) return `${label} مطلوب.`;
  if (source.includes("email")) return `صيغة ${label} غير صحيحة.`;
  if (source.includes("unique") || source.includes("already") || source.includes("taken")) return `${label} مستخدم مسبقًا.`;
  if (source.includes("confirmed") || source.includes("confirmation")) return `${label} غير متطابق.`;
  if (source.includes("min")) return `${label} أقصر من الحد المسموح.`;
  if (source.includes("max")) return `${label} أطول من الحد المسموح.`;
  if (source.includes("exists") || source.includes("invalid")) return `قيمة ${label} غير صحيحة.`;
  return `يرجى التحقق من ${label}.`;
}

export function normalizeApiError<TField extends string = string>(error: unknown, options: Options = {}): NormalizedApiError<TField> {
  if (!axios.isAxiosError<ApiError>(error)) return { status: null, message: API_ERROR_MESSAGES.unknown, fieldErrors: {} };
  const axiosError = error as AxiosError<ApiError>;
  const status = axiosError.response?.status ?? null;
  const fieldErrors: ApiFieldErrors<TField> = {};
  Object.entries(axiosError.response?.data?.errors ?? {}).forEach(([serverField, messages]) => {
    const field = (options.fieldAliases?.[serverField] ?? aliases[serverField] ?? camel(serverField)) as TField;
    fieldErrors[field] = translate(field, messages);
  });

  if (axiosError.code === "ERR_CANCELED") return { status, message: API_ERROR_MESSAGES.cancelled, fieldErrors };
  if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") return { status, message: API_ERROR_MESSAGES.timeout, fieldErrors };
  if (!axiosError.response) return { status: null, message: API_ERROR_MESSAGES.network, fieldErrors };

  const message = status === 400 ? API_ERROR_MESSAGES.badRequest
    : status === 401 ? (options.isLogin ? API_ERROR_MESSAGES.invalidCredentials : API_ERROR_MESSAGES.sessionExpired)
    : status === 403 ? API_ERROR_MESSAGES.forbidden
    : status === 404 ? API_ERROR_MESSAGES.notFound
    : status === 409 ? API_ERROR_MESSAGES.conflict
    : status === 422 ? API_ERROR_MESSAGES.validation
    : status === 429 ? API_ERROR_MESSAGES.tooManyRequests
    : status === 503 ? API_ERROR_MESSAGES.serviceUnavailable
    : status !== null && status >= 500 ? API_ERROR_MESSAGES.serverError
    : API_ERROR_MESSAGES.unknown;
  return { status, message, fieldErrors };
}

export function applyApiFieldErrorsToForm<TValues extends FieldValues>(error: unknown, setError: UseFormSetError<TValues>, fieldAliases: Record<string, string> = {}): NormalizedApiError {
  const normalized = normalizeApiError(error, { fieldAliases });
  Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
    if (message) setError(field as Path<TValues>, { type: "server", message });
  });
  return normalized;
}
