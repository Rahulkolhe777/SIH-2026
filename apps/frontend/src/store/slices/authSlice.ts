import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginPayload,
  OtpVerificationType,
  RegisterPayload,
  SendOtpPayload,
  User,
  VerifyOtpPayload,
} from "../../interfaces";
import {
  apiGetCurrentUser,
  apiLogin,
  apiRegister,
  apiSendOtp,
  apiVerifyOtp,
} from "../../services/auth.api";

const initialUser: User | null = (() => {
  try {
    const saved = localStorage.getItem("mandi_current_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
})();

const initialToken: string | null = (() => {
  try {
    return localStorage.getItem("mandi_access_token") || null;
  } catch {
    return null;
  }
})();

const initialState: AuthState = {
  user: initialUser,
  accessToken: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  otpSent: false,
  pendingIdentifier: null,
  pendingOtpType: "EMAIL_VERIFICATION",
  error: null,
  errorCode: null,
  successMessage: null,
};

// Async Thunks
export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    const response = await apiRegister(payload);
    if (!response.success) {
      return rejectWithValue(
        response.error?.message || response.message || "Registration failed. Please check your details."
      );
    }
    return {
      data: response.data,
      email: payload.email,
    };
  }
);

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    const response = await apiLogin(payload);
    if (!response.success || !response.data) {
      const code = response.code || response.error?.code || "AUTH_ERROR";
      const message =
        response.error?.message || response.message || "Invalid credentials. Please check your details.";

      if (code === "ACCOUNT_NOT_VERIFIED" || (message && message.includes("not verified"))) {
        return rejectWithValue({
          code: "ACCOUNT_NOT_VERIFIED",
          identifier: payload.identifier,
          message: "Account not verified yet. A fresh OTP has been dispatched to your email.",
        });
      }
      return rejectWithValue({
        code,
        message,
      });
    }
    return response.data;
  }
);

export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async (payload: SendOtpPayload, { rejectWithValue }) => {
    const response = await apiSendOtp(payload);
    if (!response.success) {
      return rejectWithValue(response.error?.message || response.message || "Failed to send OTP code.");
    }
    return {
      message: response.data?.message || response.message || "OTP sent successfully.",
      identifier: payload.identifier,
      type: payload.type || "EMAIL_VERIFICATION",
      otp: response.data?.otp,
    };
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    const response = await apiVerifyOtp(payload);
    if (!response.success || !response.data) {
      return rejectWithValue(
        response.error?.message || response.message || "Invalid or expired OTP code. Please try again."
      );
    }
    return response.data;
  }
);

export const fetchCurrentUserThunk = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    const response = await apiGetCurrentUser();
    if (!response.success || !response.data) {
      return rejectWithValue("Failed to fetch session.");
    }
    return response.data.user;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.errorCode = null;
      state.successMessage = null;
    },
    setPendingVerification: (
      state,
      action: PayloadAction<{ identifier: string; type?: OtpVerificationType }>
    ) => {
      state.pendingIdentifier = action.payload.identifier;
      state.pendingOtpType = action.payload.type || "EMAIL_VERIFICATION";
      state.otpSent = true;
    },
    clearPendingVerification: (state) => {
      state.pendingIdentifier = null;
      state.otpSent = false;
      state.errorCode = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.errorCode = null;
      state.successMessage = null;
      state.otpSent = false;
      state.pendingIdentifier = null;
      try {
        localStorage.removeItem("mandi_current_user");
        localStorage.removeItem("mandi_access_token");
      } catch (e) {
        console.error(e);
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingIdentifier = action.payload.email;
        state.pendingOtpType = "EMAIL_VERIFICATION";
        state.otpSent = true;
        state.errorCode = null;
        state.successMessage = "Account created! Please enter the 6-digit OTP code sent to your email.";
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Registration failed.";
        state.errorCode = "REGISTRATION_FAILED";
      });

    // Login
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.pendingIdentifier = null;
        state.otpSent = false;
        state.errorCode = null;
        state.successMessage = `Welcome back, ${action.payload.user.name}!`;
        try {
          localStorage.setItem("mandi_current_user", JSON.stringify(action.payload.user));
          localStorage.setItem("mandi_access_token", action.payload.accessToken);
        } catch (e) {
          console.error(e);
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        if (payload?.code === "ACCOUNT_NOT_VERIFIED") {
          state.pendingIdentifier = payload.identifier;
          state.pendingOtpType = "EMAIL_VERIFICATION";
          state.otpSent = true;
          state.errorCode = "ACCOUNT_NOT_VERIFIED";
          state.error = payload.message;
        } else {
          state.errorCode = payload?.code || "AUTH_ERROR";
          state.error = (typeof payload === "string" ? payload : payload?.message) || "Invalid credentials.";
        }
      });

    // Send OTP
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.pendingIdentifier = action.payload.identifier;
        state.pendingOtpType = action.payload.type;
        state.successMessage = action.payload.message;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to send OTP.";
      });

    // Verify OTP
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken || null;
          state.isAuthenticated = true;
          try {
            localStorage.setItem("mandi_current_user", JSON.stringify(action.payload.user));
            if (action.payload.accessToken) {
              localStorage.setItem("mandi_access_token", action.payload.accessToken);
            }
          } catch (e) {
            console.error(e);
          }
        }
        state.pendingIdentifier = null;
        state.otpSent = false;
        state.successMessage = action.payload.message || "Account verified successfully!";
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Invalid or expired OTP code.";
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthMessages, setPendingVerification, clearPendingVerification, logout } =
  authSlice.actions;
export default authSlice.reducer;
