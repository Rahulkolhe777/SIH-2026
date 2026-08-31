export type UserRole = "FARMER" | "BUYER" | "MANDI_OPERATOR" | "ADMIN";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "FARMER" | "MANDI_OPERATOR" | "ADMIN";
}

export interface RoleRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface SendOtpPayload {
  identifier: string;
  type: "EMAIL_VERIFICATION" | "LOGIN_OTP" | "PASSWORD_RESET";
}

export interface VerifyOtpPayload {
  identifier: string;
  code: string;
  type: "EMAIL_VERIFICATION" | "LOGIN_OTP" | "PASSWORD_RESET";
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
