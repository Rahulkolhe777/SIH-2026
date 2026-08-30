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
    return typeof window !== "undefined" ? window.location.pathname : "/login";
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

  const handleAuthSuccess = () => {
    const targetRoute =
      currentUser?.role === "MANDI_OPERATOR" ? "/mandi/dashboard" : "/farmer/dashboard";
    window.history.pushState({}, "", targetRoute);
    setCurrentPath(targetRoute);
  };

  // 1. Unauthenticated or Explicit /login, /register
  if (!isAuthenticated || currentPath === "/login" || currentPath === "/register") {
    const initialMode = currentPath === "/register" ? "REGISTER" : "LOGIN";
    return <AuthPageContent initialMode={initialMode} onSuccess={handleAuthSuccess} />;
  }

  // 2. Mandi Operator Dashboard Route
  if (currentPath === "/mandi/dashboard" || (currentPath === "/dashboard" && currentUser?.role === "MANDI_OPERATOR")) {
    return (
      <MandiOperatorDashboard
        operatorName={currentUser?.name || "Operator"}
        mandiName="Indore APMC Yard #01"
      />
    );
  }

  // 3. Farmer Dashboard Route (Default for Farmers)
  return (
    <FarmerDashboard
      userName={currentUser?.name || "Jane"}
      avatarUrl="/images/avatar-1.jpg"
    />
  );
}
