export type Role = "FARMER" | "MANDI_OPERATOR" | "ADMIN" | "TRADER" | "TRANSPORTER";

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
  type: "LOGIN" | "EMAIL_VERIFICATION" | "PHONE_VERIFICATION" | "PASSWORD_RESET";
}

export interface VerifyOtpPayload {
  identifier: string;
  code: string;
  type: "LOGIN" | "EMAIL_VERIFICATION" | "PHONE_VERIFICATION" | "PASSWORD_RESET";
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
  error: string | null;
  successMessage: string | null;
}
