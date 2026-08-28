# Frontend Integration Guide for Auth Module

This guide provides frontend developers with step-by-step instructions, patterns, and production-ready code examples (React / Next.js / TypeScript) for integrating with the Authentication and RBAC backend.

---

## 1. Authentication Architecture for Frontend

### Token Lifecycle Strategy
- **`accessToken`**: Short-lived JWT (15 min). Stored in memory or secure storage. Sent in the `Authorization: Bearer <token>` header with every API request.
- **`refreshToken`**: Long-lived token (7 days). Stored in `localStorage` / `sessionStorage` (or HTTP-only cookie). Used to silently obtain a new `accessToken` when receiving a `401 Unauthorized` / `TOKEN_EXPIRED_OR_INVALID` error.

---

## 2. API Client with Auto-Refresh Interceptor (Axios Example)

```typescript
// lib/apiClient.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic token refresh interceptor on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login?session_expired=true";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 3. React Auth Context & Hook

```tsx
// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/apiClient";

export type UserRole = "FARMER" | "MANDI_OPERATOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone?: string; password: string; role: UserRole }) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        return;
      }
      const response = await apiClient.get("/auth/me");
      setUser(response.data.data.user);
    } catch {
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    const { data } = await apiClient.post("/auth/login", { identifier, password });
    const { user: userData, accessToken, refreshToken } = data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(userData);
    return userData;
  };

  const register = async (formData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
  }): Promise<User> => {
    const { data } = await apiClient.post("/auth/register", formData);
    const { user: userData, accessToken, refreshToken } = data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } finally {
      localStorage.clear();
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshProfile: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

---

## 4. Protected Route & Role Guard Component

```tsx
// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom"; // or Next.js router
import { useAuth, UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireVerification = false,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="spinner">Loading session...</div>;
  }

  // 1. Check if authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if verified (if required)
  if (requireVerification && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // 3. Check Role-Based Access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective home dashboard if they try to access cross-role page
    const redirectUrl = user.role === "FARMER" ? "/farmer/dashboard" : "/mandi/dashboard";
    return <Navigate to={redirectUrl} replace />;
  }

  return <>{children}</>;
};
```

---

## 5. Post-Login / Registration Redirection Strategy

After login or registration, inspect `user.role` to redirect the user to their appropriate landing area:

```typescript
const handleLoginSuccess = (user: User) => {
  if (user.role === "FARMER") {
    navigate("/farmer/dashboard");
  } else if (user.role === "MANDI_OPERATOR") {
    navigate("/mandi/dashboard");
  } else if (user.role === "ADMIN") {
    navigate("/admin/dashboard");
  }
};
```

---

## 6. OTP Verification Component Pattern

```tsx
// components/OtpVerificationModal.tsx
import React, { useState } from "react";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";

export const OtpVerificationModal: React.FC<{ email: string; onSuccess: () => void }> = ({
  email,
  onSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const { refreshProfile } = useAuth();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post("/auth/verify-otp", {
        identifier: email,
        code: otp,
        type: "EMAIL_VERIFICATION",
      });

      await refreshProfile();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP code.");
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await apiClient.post("/auth/send-otp", {
        identifier: email,
        type: "EMAIL_VERIFICATION",
      });
      alert("New OTP sent to your email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="otp-card">
      <h3>Verify Your Email</h3>
      <p>Enter the 6-digit code sent to {email}</p>

      {error && <div className="error-banner">{error}</div>}

      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="123456"
        className="otp-input"
        required
      />

      <button type="submit" className="btn-primary">Verify Account</button>
      <button type="button" onClick={handleResendOtp} disabled={resending} className="btn-secondary">
        {resending ? "Sending..." : "Resend OTP"}
      </button>
    </form>
  );
};
```

---

## 7. Password Reset Screen Pattern

```tsx
// pages/ResetPassword.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/apiClient";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await apiClient.post("/auth/reset-password", {
        email,
        token,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  if (success) {
    return <div className="alert-success">Password reset successfully! Redirecting to login...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      <h2>Create New Password</h2>
      {error && <div className="alert-danger">{error}</div>}

      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password (min. 8 characters)"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        required
      />

      <button type="submit" className="btn-primary">Save New Password</button>
    </form>
  );
};
```
