import type { ApiErrorResponse, TokenRefreshData } from "../interfaces";

const API_BASE_URL =
  (typeof globalThis !== "undefined" &&
    (globalThis as Record<string, unknown>)["BUN_PUBLIC_API_URL"]) ||
  "http://localhost:4000/api/v1";

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("refreshToken", token);
  } else {
    localStorage.removeItem("refreshToken");
  }
};

export const clearTokens = () => {
  accessToken = null;
  localStorage.removeItem("refreshToken");
};

const attemptTokenRefresh = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ApiErrorResponse;
      if (
        errorData.code === "REFRESH_TOKEN_EXPIRED" ||
        errorData.code === "TOKEN_REUSE_DETECTED" ||
        errorData.code === "INVALID_REFRESH_TOKEN"
      ) {
        clearTokens();
        window.location.href = "/login";
        return null;
      }
      return null;
    }

    const result = (await response.json()) as {
      success: true;
      data: TokenRefreshData;
    };
    const { accessToken: newAccess, refreshToken: newRefresh } = result.data;
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    return newAccess;
  } catch {
    clearTokens();
    return null;
  }
};

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 — attempt silent token refresh (Flow 4 from docs)
  if (response.status === 401) {
    const errorData = (await response.clone().json()) as ApiErrorResponse;

    if (
      errorData.code === "TOKEN_EXPIRED_OR_INVALID" ||
      errorData.code === "UNAUTHORIZED"
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await attemptTokenRefresh();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          headers["Authorization"] = `Bearer ${newToken}`;
          response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
          });
        } else {
          throw errorData;
        }
      } else {
        // Wait for the ongoing refresh to complete
        const newToken = await new Promise<string>((resolve) => {
          subscribeTokenRefresh(resolve);
        });
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(`${API_BASE_URL}${path}`, {
          ...options,
          headers,
        });
      }
    }
  }

  const result = await response.json();

  if (!response.ok || !(result as { success: boolean }).success) {
    throw result as ApiErrorResponse;
  }

  return result as T;
};

export const apiPost = <T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> =>
  apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiGet = <T>(path: string): Promise<T> =>
  apiRequest<T>(path, { method: "GET" });
