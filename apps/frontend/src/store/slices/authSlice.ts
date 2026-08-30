import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginPayload,
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
  error: null,
  successMessage: null,
};

// Async Thunks
export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    const response = await apiRegister(payload);
    if (!response.success || !response.data) {
      return rejectWithValue(response.error?.message || "Registration failed. Please try again.");
    }
    return response.data;
  }
);

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    const response = await apiLogin(payload);
    if (!response.success || !response.data) {
      return rejectWithValue(response.error?.message || "Invalid credentials. Please check your details.");
    }
    return response.data;
  }
);

export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async (payload: SendOtpPayload, { rejectWithValue }) => {
    const response = await apiSendOtp(payload);
    if (!response.success) {
      return rejectWithValue(response.error?.message || "Failed to send OTP code.");
    }
    return response.data?.message || "OTP sent successfully.";
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    const response = await apiVerifyOtp(payload);
    if (!response.success || !response.data) {
      return rejectWithValue(response.error?.message || "Invalid or expired OTP code.");
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
      state.successMessage = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
      state.otpSent = false;
      try {
        localStorage.removeItem("mandi_current_user");
        localStorage.removeItem("mandi_access_token");
      } catch (e) {
        console.error(e);
      }
    },
    setMockUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.accessToken = "mock-dev-token";
      try {
        localStorage.setItem("mandi_current_user", JSON.stringify(action.payload));
        localStorage.setItem("mandi_access_token", "mock-dev-token");
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
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = `Account created for ${action.payload.user.name}! Please sign in.`;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
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
        state.error = action.payload as string;
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
        state.successMessage = action.payload;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify OTP
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.successMessage = `Signed in successfully as ${action.payload.user.name}!`;
        try {
          localStorage.setItem("mandi_current_user", JSON.stringify(action.payload.user));
          localStorage.setItem("mandi_access_token", action.payload.accessToken);
        } catch (e) {
          console.error(e);
        }
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state) => {
        // If session invalid, clear token
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthMessages, logout, setMockUser } = authSlice.actions;
export default authSlice.reducer;
