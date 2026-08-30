import type {
  ApiResponse,
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  SendOtpPayload,
  User,
  VerifyOtpPayload,
} from "../interfaces";

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined" && (window as any).__API_URL__) {
    return (window as any).__API_URL__;
  }
  return "http://localhost:4000";
};

/**
 * Pure modular function to make standard API requests
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const token = typeof window !== "undefined" ? localStorage.getItem("mandi_access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error?.message || "Failed to communicate with server.",
      },
    };
  }
}

export async function apiRegister(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
  return request<AuthResponseData>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiLogin(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
  return request<AuthResponseData>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiSendOtp(payload: SendOtpPayload): Promise<ApiResponse<{ message: string }>> {
  return request<{ message: string }>("/api/v1/auth/otp/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiVerifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<AuthResponseData>> {
  return request<AuthResponseData>("/api/v1/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGetCurrentUser(): Promise<ApiResponse<{ user: User }>> {
  return request<{ user: User }>("/api/v1/auth/me", {
    method: "GET",
  });
}
