export type Role = "FARMER" | "MANDI_OPERATOR";
export type OtpType = "EMAIL_VERIFICATION" | "LOGIN_OTP" | "PASSWORD_RESET";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
}

export interface VerifyOtpPayload {
  identifier: string;
  code: string;
  type: OtpType;
}

export interface SendOtpPayload {
  identifier: string;
  type: OtpType;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface ApiSuccessResponse<T = Record<string, unknown>> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Array<{ field: string; message: string }>;
}

export type ApiResponse<T = Record<string, unknown>> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface TokenRefreshData {
  accessToken: string;
  refreshToken: string;
}

export interface OtpResponseData {
  success: boolean;
  message: string;
  isVerified?: boolean;
}

export interface MessageResponseData {
  success: boolean;
  message: string;
}
