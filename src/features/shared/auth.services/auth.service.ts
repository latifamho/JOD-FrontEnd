import { api } from "@/services/api";
import { END_POINTS } from "@/features/shared/query-apis";
import type {
  CompanyRegisterRequest,
  CompanyRegisterResponse,
  DashboardContextResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./auth.type";

export const authServices = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(END_POINTS.AUTH.LOGIN, data, { skipSuccessToast: true, skipErrorToast: true });
    return response.data;
  },

  async registerOrganization(data: CompanyRegisterRequest, logoFile: File): Promise<CompanyRegisterResponse> {
    const form = new FormData();
    form.append("companyName", data.companyName);
    form.append("organizationNumber", data.organizationNumber);
    form.append("registrationNumber", data.registrationNumber);
    form.append("bankAccountNumber", data.bankAccountNumber);
    form.append("companyEmail", data.companyEmail);
    form.append("companyPhone", data.companyPhone);
    form.append("location", data.location);
    if (data.website) form.append("website", data.website);

    data.founders.forEach((founder, index) => {
      form.append(`founders[${index}][name]`, founder.name);
      form.append(`founders[${index}][email]`, founder.email);
      form.append(`founders[${index}][phone]`, founder.phone);
      form.append(`founders[${index}][password]`, founder.password);
      form.append(`founders[${index}][password_confirmation]`, founder.password_confirmation);
    });

    form.append("logo", logoFile, logoFile.name);
    const response = await api.post<CompanyRegisterResponse>(END_POINTS.COMPANY_AUTH.REGISTER, form, { skipSuccessToast: true, skipErrorToast: true });
    return response.data;
  },

  async refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(END_POINTS.AUTH.REFRESH, data, { skipSuccessToast: true, skipErrorToast: true });
    return response.data;
  },

  async logout(): Promise<void> { await api.post(END_POINTS.AUTH.LOGOUT, undefined, { skipSuccessToast: true }); },
  async getMe(): Promise<MeResponse> { return (await api.get<MeResponse>(END_POINTS.ME.PROFILE)).data; },
  async getDashboardContext(): Promise<DashboardContextResponse> { return (await api.get<DashboardContextResponse>(END_POINTS.ME.DASHBOARD_CONTEXT)).data; },
};
