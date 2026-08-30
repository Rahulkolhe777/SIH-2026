import React, { useState, useEffect } from "react";
import { AuthPageContent } from "./components/AuthPageContent";
import { FarmerDashboard } from "./components/dashboard/FarmerDashboard";
import { MandiOperatorDashboard } from "./components/dashboard/MandiOperatorDashboard";
import { useAppDispatch, useAppSelector } from "./store";
import { fetchCurrentUserThunk } from "./store/slices/authSlice";
import "./index.css";

export function App() {
  const dispatch = useAppDispatch();
  const { user: currentUser, isAuthenticated } = useAppSelector((state) => state.auth);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== "undefined" ? window.location.pathname : "/farmer/dashboard";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch active session on mount
  useEffect(() => {
    if (localStorage.getItem("mandi_access_token")) {
      dispatch(fetchCurrentUserThunk());
    }
  }, [dispatch]);

  // Automatic Route Guard: If authenticated, redirect away from /login, /register, or /
  useEffect(() => {
    if (isAuthenticated && (currentPath === "/login" || currentPath === "/register" || currentPath === "/")) {
      const targetRoute =
        currentUser?.role === "MANDI_OPERATOR" ? "/mandi/dashboard" : "/farmer/dashboard";
      window.history.replaceState({}, "", targetRoute);
      setCurrentPath(targetRoute);
    }
  }, [isAuthenticated, currentUser?.role, currentPath]);

  const handleAuthSuccess = () => {
    const targetRoute =
      currentUser?.role === "MANDI_OPERATOR" ? "/mandi/dashboard" : "/farmer/dashboard";
    window.history.replaceState({}, "", targetRoute);
    setCurrentPath(targetRoute);
  };

  // 1. If Authenticated, render appropriate Dashboard (blocks /login and /register)
  if (isAuthenticated) {
    if (currentPath === "/mandi/dashboard" || currentUser?.role === "MANDI_OPERATOR") {
      return (
        <MandiOperatorDashboard
          operatorName={currentUser?.name || "Operator"}
          mandiName="Indore APMC Yard #01"
        />
      );
    }
    return (
      <FarmerDashboard
        userName={currentUser?.name || "Ramesh Patel"}
        avatarUrl="/images/avatar-1.jpg"
      />
    );
  }

  // 2. If Unauthenticated, render AuthPageContent
  const initialMode = currentPath === "/register" ? "REGISTER" : "LOGIN";
  return <AuthPageContent initialMode={initialMode} onSuccess={handleAuthSuccess} />;
}
