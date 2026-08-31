import React, { useState } from "react";
import { Navbar } from "./components/Navbar.js";
import { HomePage } from "./pages/HomePage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { TokenState } from "./interfaces/index.js";
import { parseJwtPayload } from "./services/apiClient.js";

export function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hasToken = localStorage.getItem("sih_access_token");
    return hasToken ? "dashboard" : "home";
  });

  const [tokenState, setTokenState] = useState<TokenState>(() => {
    const savedAccess = localStorage.getItem("sih_access_token") || "";
    const savedRefresh = localStorage.getItem("sih_refresh_token") || "";
    const parsed = savedAccess ? parseJwtPayload(savedAccess) : null;
    return {
      accessToken: savedAccess,
      refreshToken: savedRefresh,
      role: (parsed?.role as string) || null,
      email: (parsed?.email as string) || null,
      userId: (parsed?.userId as string) || null,
      expiresAt: parsed?.exp ? new Date((parsed.exp as number) * 1000).toLocaleTimeString() : null,
    };
  });

  const handleLoginSuccess = (
    accessToken: string,
    refreshToken?: string,
    role?: string,
    email?: string,
    userId?: string
  ) => {
    localStorage.setItem("sih_access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("sih_refresh_token", refreshToken);
    }
    const parsed = parseJwtPayload(accessToken);
    setTokenState({
      accessToken,
      refreshToken: refreshToken || tokenState.refreshToken,
      role: role || (parsed?.role as string) || null,
      email: email || (parsed?.email as string) || null,
      userId: userId || (parsed?.userId as string) || null,
      expiresAt: parsed?.exp ? new Date((parsed.exp as number) * 1000).toLocaleTimeString() : null,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("sih_access_token");
    localStorage.removeItem("sih_refresh_token");
    setTokenState({
      accessToken: "",
      refreshToken: "",
      role: null,
      email: null,
      userId: null,
      expiresAt: null,
    });
    setCurrentPage("login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        tokenState={tokenState}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentPage === "home" && (
          <HomePage
            onNavigate={setCurrentPage}
            isLoggedIn={Boolean(tokenState.accessToken)}
          />
        )}

        {currentPage === "login" && (
          <LoginPage
            onNavigate={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === "register" && (
          <RegisterPage
            onNavigate={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === "forgot-password" && (
          <ForgotPasswordPage
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === "dashboard" && (
          <DashboardPage
            tokenState={tokenState}
            onLogout={handleLogout}
            onTokenUpdate={handleLoginSuccess}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} KrishiSetu &bull; Smart India Hackathon</span>
          <span className="font-mono text-slate-400">apps/f-test frontend client</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
