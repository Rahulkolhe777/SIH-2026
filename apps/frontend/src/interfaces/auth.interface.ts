export type Role = "FARMER" | "MANDI_OPERATOR" | "ADMIN" | "TRADER" | "TRANSPORTER";

export type OtpVerificationType = "EMAIL_VERIFICATION" | "LOGIN_OTP" | "PASSWORD_RESET";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  location?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface SendOtpPayload {
  identifier: string;
  type?: OtpVerificationType;
}

export interface VerifyOtpPayload {
  identifier: string;
  code: string;
  type?: OtpVerificationType;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  pendingIdentifier: string | null;
  pendingOtpType: OtpVerificationType;
  error: string | null;
  errorCode: string | null;
  successMessage: string | null;
}
