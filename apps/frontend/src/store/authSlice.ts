import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  SendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ApiErrorResponse,
  ApiSuccessResponse,
  AuthResponseData,
  OtpResponseData,
  MessageResponseData,
  User,
} from "../interfaces";
import {
  apiPost,
  apiGet,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "../lib/apiClient";

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: getRefreshToken(),
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const extractErrorMessage = (err: unknown): string => {
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as ApiErrorResponse).message === "string"
  ) {
    return (err as ApiErrorResponse).message;
  }
  if (err instanceof TypeError) {
    return "Unable to reach the authentication service.";
  }
  return "An unexpected error occurred.";
};

const extractErrorCode = (err: unknown): string | undefined => {
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as ApiErrorResponse).code === "string"
  ) {
    return (err as ApiErrorResponse).code;
  }
  return undefined;
};

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------

export const loginUser = createAsyncThunk<
  AuthResponseData,
  LoginPayload,
  { rejectValue: { message: string; code?: string } }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const result = await apiPost<ApiSuccessResponse<AuthResponseData>>(
      "/auth/login",
      payload as unknown as Record<string, unknown>,
    );
    setAccessToken(result.data.accessToken);
    setRefreshToken(result.data.refreshToken);
    return result.data;
  } catch (err) {
    return rejectWithValue({
      message: extractErrorMessage(err),
      code: extractErrorCode(err),
    });
  }
});

export const registerUser = createAsyncThunk<
  AuthResponseData,
  RegisterPayload,
  { rejectValue: { message: string; code?: string } }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const result = await apiPost<ApiSuccessResponse<AuthResponseData>>(
      "/auth/register",
      payload as unknown as Record<string, unknown>,
    );
    setAccessToken(result.data.accessToken);
    setRefreshToken(result.data.refreshToken);
    return result.data;
  } catch (err) {
    return rejectWithValue({
      message: extractErrorMessage(err),
      code: extractErrorCode(err),
    });
  }
});

export const verifyOtp = createAsyncThunk<
  OtpResponseData,
  VerifyOtpPayload,
  { rejectValue: { message: string } }
>("auth/verifyOtp", async (payload, { rejectWithValue }) => {
  try {
    const result = await apiPost<ApiSuccessResponse<OtpResponseData>>(
      "/auth/verify-otp",
      payload as unknown as Record<string, unknown>,
    );
    return result.data;
  } catch (err) {
    return rejectWithValue({ message: extractErrorMessage(err) });
  }
});

export const sendOtp = createAsyncThunk<
  OtpResponseData,
  SendOtpPayload,
  { rejectValue: { message: string } }
>("auth/sendOtp", async (payload, { rejectWithValue }) => {
  try {
    const result = await apiPost<ApiSuccessResponse<OtpResponseData>>(
      "/auth/send-otp",
      payload as unknown as Record<string, unknown>,
    );
    return result.data;
  } catch (err) {
    return rejectWithValue({ message: extractErrorMessage(err) });
  }
});

export const forgotPassword = createAsyncThunk<
  MessageResponseData,
  ForgotPasswordPayload,
  { rejectValue: { message: string } }
>("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    const result = await apiPost<ApiSuccessResponse<MessageResponseData>>(
      "/auth/forgot-password",
      payload as unknown as Record<string, unknown>,
    );
    return result.data;
  } catch (err) {
    return rejectWithValue({ message: extractErrorMessage(err) });
  }
});

export const resetPassword = createAsyncThunk<
  MessageResponseData,
  ResetPasswordPayload,
  { rejectValue: { message: string } }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    const result = await apiPost<ApiSuccessResponse<MessageResponseData>>(
      "/auth/reset-password",
      payload as unknown as Record<string, unknown>,
    );
    return result.data;
  } catch (err) {
    return rejectWithValue({ message: extractErrorMessage(err) });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string } }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await apiPost<ApiSuccessResponse<MessageResponseData>>("/auth/logout", {
        refreshToken,
      });
    }
    clearTokens();
  } catch (err) {
    clearTokens();
    return rejectWithValue({ message: extractErrorMessage(err) });
  }
});

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: { message: string } }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const result = await apiGet<ApiSuccessResponse<{ user: User }>>(
      "/auth/me",
    );
    return result.data.user;
  } catch (err) {
    return rejectWithValue({ message: extractErrorMessage(err) });
  }
});

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    resetAuth() {
      clearTokens();
      return { ...initialState, refreshToken: null };
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.message =
          action.payload.message ?? "Login successful. Welcome to MandiConnect.";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unable to sign in.";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.message =
          action.payload.message ??
          "Registration successful. Please verify your email.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? "Unable to create your account.";
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message ?? "Account verified successfully.";
        if (state.user) {
          state.user.isVerified = true;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? "The verification code is invalid.";
      });

    // Send OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message ?? "A verification code has been sent.";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unable to send the OTP.";
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message ??
          "Password reset instructions have been sent to your email.";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? "Unable to start password recovery.";
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message ?? "Password reset successful.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ?? "Unable to reset password.";
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.message = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
      });

    // Fetch current user (bootstrap session)
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        clearTokens();
      });
  },
});

export const { clearError, clearMessage, setTokens, resetAuth } =
  authSlice.actions;
export default authSlice.reducer;
