export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  method: HttpMethod;
  endpoint: string;
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
  token?: string | null;
}

export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  durationMs: number;
  data: T;
  headers: Record<string, string>;
  timestamp: string;
  ok: boolean;
}

export interface RequestLog {
  id: string;
  timestamp: string;
  method: HttpMethod;
  endpoint: string;
  status: number;
  durationMs: number;
  success: boolean;
  requestBody?: unknown;
  responseBody?: unknown;
}

export interface TokenState {
  accessToken: string;
  refreshToken: string;
  role: string | null;
  email: string | null;
  userId: string | null;
  expiresAt: string | null;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  environment: string;
}
