import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterPageUI from "@repo/ui/pages/Register";
import type { RegisterMode } from "@repo/ui/pages/Register";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  registerUser,
  verifyOtp,
  clearError,
  clearMessage,
} from "../store/authSlice";

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, message, isAuthenticated, user } = useAppSelector(
    (state) => state.auth,
  );
  const [mode, setMode] = useState<RegisterMode>("register");

  // Redirect if already authenticated (after verification)
  useEffect(() => {
    if (isAuthenticated && user?.isVerified) {
      if (user.role === "FARMER") {
        navigate("/farmer/dashboard", { replace: true });
      } else if (user.role === "MANDI_OPERATOR") {
        navigate("/mandi/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRegister = useCallback(
    async (data: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: "FARMER" | "MANDI_OPERATOR";
    }) => {
      dispatch(clearError());
      dispatch(clearMessage());
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        setMode("verify");
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
        // Verification successful — redirect to login
        navigate("/login");
      }
    },
    [dispatch, navigate],
  );

  const handleNavigateLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleModeChange = useCallback(
    (newMode: RegisterMode) => {
      dispatch(clearError());
      dispatch(clearMessage());
      setMode(newMode);
    },
    [dispatch],
  );

  return (
    <RegisterPageUI
      mode={mode}
      loading={loading}
      error={error}
      message={message}
      onRegister={handleRegister}
      onVerifyOtp={handleVerifyOtp}
      onNavigateLogin={handleNavigateLogin}
      onModeChange={handleModeChange}
    />
  );
}

export default RegisterPage;
