import { RequestConfig, ApiResponse } from "../interfaces/index.js";

const DEFAULT_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:4000";

let customBaseUrl = DEFAULT_BASE_URL;

export function getBaseUrl(): string {
  return customBaseUrl;
}

export function setBaseUrl(url: string): void {
  customBaseUrl = url.replace(/\/$/, "");
}

export async function executeApiRequest<T = unknown>(
  config: RequestConfig
): Promise<ApiResponse<T>> {
  const startTime = performance.now();
  const url = config.endpoint.startsWith("http")
    ? config.endpoint
    : `${customBaseUrl}${config.endpoint.startsWith("/") ? config.endpoint : `/${config.endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(config.headers || {}),
  };

  if (config.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  const fetchOptions: RequestInit = {
    method: config.method,
    headers,
  };

  if (config.body && ["POST", "PUT", "PATCH", "DELETE"].includes(config.method)) {
    fetchOptions.body = JSON.stringify(config.body);
  }

  let rawResponse: Response;
  try {
    rawResponse = await fetch(url, fetchOptions);
  } catch (networkError: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = networkError instanceof Error ? networkError.message : "Failed to fetch";
    return {
      status: 0,
      statusText: "Network Error",
      durationMs,
      data: {
        error: "Network Error / Backend Unreachable",
        message: errorMessage,
        suggestion: `Ensure the backend server is running on ${customBaseUrl} and CORS allows origin http://localhost:5173.`,
      } as unknown as T,
      headers: {},
      timestamp: new Date().toISOString(),
      ok: false,
    };
  }

  const durationMs = Math.round(performance.now() - startTime);

  const responseHeaders: Record<string, string> = {};
  rawResponse.headers.forEach((val, key) => {
    responseHeaders[key] = val;
  });

  let data: T;
  const contentType = rawResponse.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await rawResponse.json();
    } catch {
      data = (await rawResponse.text()) as unknown as T;
    }
  } else {
    data = (await rawResponse.text()) as unknown as T;
  }

  return {
    status: rawResponse.status,
    statusText: rawResponse.statusText,
    durationMs,
    data,
    headers: responseHeaders,
    timestamp: new Date().toISOString(),
    ok: rawResponse.ok,
  };
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
