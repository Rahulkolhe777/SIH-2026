const DEFAULT_BASE_URL = "http://localhost:4000/api/v1";

export function getApiBaseUrl(): string {
  return localStorage.getItem("mandi_api_url") || DEFAULT_BASE_URL;
}

export function setApiBaseUrl(url: string): void {
  localStorage.setItem("mandi_api_url", url);
}

export function getAccessToken(): string | null {
  return localStorage.getItem("mandi_access_token");
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem("mandi_access_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("mandi_refresh_token", refreshToken);
  }
}

export function clearTokens(): void {
  localStorage.removeItem("mandi_access_token");
  localStorage.removeItem("mandi_refresh_token");
  localStorage.removeItem("mandi_current_user");
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; code?: string; status: number }> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getAccessToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    return {
      success: response.ok && (data?.success ?? true),
      data: data?.data ?? data,
      message: data?.message || response.statusText,
      code: data?.code,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network Error: Could not connect to backend",
      status: 0,
    };
  }
}
