import { apiClient } from "./apiClient";
import type {
  ApiResponse,
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  SendOtpPayload,
  User,
  VerifyOtpPayload,
} from "../interfaces";

/**
 * Register a new user using Axios
 */
export async function apiRegister(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>("/api/v1/auth/register", payload);
  return response.data;
}

/**
 * Log in with email/phone & password using Axios
 */
export async function apiLogin(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>("/api/v1/auth/login", payload);
  return response.data;
}

/**
 * Send or resend 6-digit OTP code using Axios
 */
export async function apiSendOtp(payload: SendOtpPayload): Promise<ApiResponse<{ message: string; otp?: string }>> {
  const response = await apiClient.post<ApiResponse<{ message: string; otp?: string }>>("/api/v1/auth/send-otp", {
    identifier: payload.identifier,
    type: payload.type || "EMAIL_VERIFICATION",
  });
  return response.data;
}

/**
 * Verify 6-digit OTP code using Axios
 */
export async function apiVerifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<AuthResponseData>> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>("/api/v1/auth/verify-otp", {
    identifier: payload.identifier,
    code: payload.code,
    type: payload.type || "EMAIL_VERIFICATION",
  });
  return response.data;
}

/**
 * Fetch currently authenticated user session using Axios
 */
export async function apiGetCurrentUser(): Promise<ApiResponse<{ user: User }>> {
  const response = await apiClient.get<ApiResponse<{ user: User }>>("/api/v1/auth/me");
  return response.data;
}
