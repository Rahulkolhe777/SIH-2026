import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPageUI from "@repo/ui/pages/Login";
import type { LoginMode } from "@repo/ui/pages/Login";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginUser,
  verifyOtp,
  sendOtp,
  forgotPassword,
  clearError,
  clearMessage,
} from "../store/authSlice";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, message, isAuthenticated, user } = useAppSelector(
    (state) => state.auth,
  );
  const [mode, setMode] = useState<LoginMode>("login");

  // Redirect if already authenticated (Flow 3: role-based navigation)
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "FARMER") {
        navigate("/farmer/dashboard", { replace: true });
      } else if (user.role === "MANDI_OPERATOR") {
        navigate("/mandi/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = useCallback(
    async (identifier: string, password: string) => {
      dispatch(clearError());
      dispatch(clearMessage());
      const result = await dispatch(loginUser({ identifier, password }));

      if (loginUser.rejected.match(result)) {
        const payload = result.payload as
          | { message: string; code?: string }
          | undefined;
        // Flow: ACCOUNT_NOT_VERIFIED → switch to OTP mode
        if (payload?.code === "ACCOUNT_NOT_VERIFIED") {
          setMode("otp");
          dispatch(
            sendOtp({ identifier, type: "EMAIL_VERIFICATION" }),
          );
        }
      }
    },
    [dispatch],
  );

  const handleVerifyOtp = useCallback(
    async (identifier: string, code: string) => {
      dispatch(clearError());
      const result = await dispatch(
        verifyOtp({ identifier, code, type: "EMAIL_VERIFICATION" }),
      );
      if (verifyOtp.fulfilled.match(result)) {
        setMode("login");
      }
    },
    [dispatch],
  );

  const handleSendOtp = useCallback(
    async (identifier: string) => {
      dispatch(clearError());
      dispatch(sendOtp({ identifier, type: "EMAIL_VERIFICATION" }));
    },
    [dispatch],
  );

  const handleForgotPassword = useCallback(
    async (email: string) => {
      dispatch(clearError());
      dispatch(forgotPassword({ email }));
    },
    [dispatch],
  );

  const handleNavigateRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  const handleModeChange = useCallback(
    (newMode: LoginMode) => {
      dispatch(clearError());
      dispatch(clearMessage());
      setMode(newMode);
    },
    [dispatch],
  );

  return (
    <LoginPageUI
      mode={mode}
      loading={loading}
      error={error}
      message={message}
      onLogin={handleLogin}
      onVerifyOtp={handleVerifyOtp}
      onSendOtp={handleSendOtp}
      onForgotPassword={handleForgotPassword}
      onNavigateRegister={handleNavigateRegister}
      onModeChange={handleModeChange}
    />
  );
}

export default LoginPage;
