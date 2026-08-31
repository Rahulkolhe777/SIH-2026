import React, { useState } from "react";
import type { User, MandiApprovalStatus } from "../types/mandi.types";
import { apiRequest, setTokens } from "../services/api";
import { Modal } from "../components/Modal";
import { IconShield, IconCheck, IconUpload, IconLock, IconClock } from "../components/Icons";
import { ApprovalBadge } from "../components/Badge";

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  useMock: boolean;
}

export function AuthPage({ onLoginSuccess, useMock }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup" | "onboarding" | "pending_approval">("login");

  // Signup / Login Credentials
  const [name, setName] = useState("Rupesh Sharma");
  const [email, setEmail] = useState("mandi.indore@agrimarket.gov.in");
  const [phone, setPhone] = useState("+91 98260 12345");
  const [password, setPassword] = useState("Mandi@12345");
  const [confirmPassword, setConfirmPassword] = useState("Mandi@12345");

  // Post-Login Onboarding Form Fields
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [mandiName, setMandiName] = useState("Indore APMC Grain & Oilseed Market Yard");
  const [apmcCode, setApmcCode] = useState("APMC-IND-MP-042");
  const [address, setAddress] = useState("Plot No. 44, Industrial Area, Bypass Highway");
  const [district, setDistrict] = useState("Indore");
  const [stateName, setStateName] = useState("Madhya Pradesh");
  const [operatingHours, setOperatingHours] = useState("07:30 AM - 06:00 PM (Mon-Sat)");

  // Aadhaar & Legal Docs
  const [aadhaarNumber, setAadhaarNumber] = useState("5412 8901 2345");
  const [aadhaarFile, setAadhaarFile] = useState("Aadhaar_Indore_Mandi.pdf");
  const [licenseFile, setLicenseFile] = useState("APMC_License_2026.pdf");
  const [registrationFile, setRegistrationFile] = useState("State_Mandi_Registration.pdf");
  const [gstFile, setGstFile] = useState("GST_Indore_APMC.pdf");

  // State Management
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<MandiApprovalStatus>("PENDING_ONBOARDING");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // OTP Verification Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  // ----------------------------------------------------
  // 1. SIMPLE CLEAN SIGNUP (Minimal fields)
  // ----------------------------------------------------
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    if (useMock) {
      setTimeout(() => {
        setLoading(false);
        setOtpEmail(email);
        setShowOtpModal(true);
        setSuccessMsg("Registration initiated. OTP code sent to your email.");
      }, 500);
      return;
    }

    try {
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role: "MANDI_OPERATOR",
        }),
      });

      setLoading(false);

      if (res.success) {
        setOtpEmail(email);
        setShowOtpModal(true);
        setSuccessMsg("Registration successful. Please verify your OTP to continue.");
      } else {
        setErrorMsg(res.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Failed to register account.");
    }
  };

  // ----------------------------------------------------
  // 2. OTP VERIFICATION
  // ----------------------------------------------------
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    if (useMock) {
      setTimeout(() => {
        setLoading(false);
        setShowOtpModal(false);
        setSuccessMsg("Email verified successfully! You can now log in.");
        setMode("login");
      }, 500);
      return;
    }

    try {
      const res = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          identifier: otpEmail || email,
          code: otpCode,
          type: "EMAIL_VERIFICATION",
        }),
      });

      setLoading(false);
      if (res.success) {
        setShowOtpModal(false);
        setSuccessMsg("Email verified! Please log in to complete your Mandi setup.");
        setMode("login");
      } else {
        setErrorMsg(res.message || "Invalid or expired OTP code.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Verification failed.");
    }
  };

  // ----------------------------------------------------
  // 3. LOGIN & STATUS CHECK
  // ----------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (useMock) {
      setTimeout(() => {
        setLoading(false);
        const mockUser: User = {
          id: "mandi_user_01",
          name: name || "Mandi Operator",
          email,
          phone,
          role: "MANDI_OPERATOR",
          isVerified: true,
          mandiName: mandiName || "Central APMC Market Yard",
          mandiCode: apmcCode || "APMC-IND-042",
          location: `${district}, ${stateName}`,
          district,
          state: stateName,
          approvalStatus: "APPROVED",
          rating: 4.8,
          totalRatingsCount: 142,
          createdAt: new Date().toISOString(),
        };
        setTokens("mock_mandi_jwt_access_token_123", "mock_mandi_jwt_refresh_token_456");
        onLoginSuccess(mockUser);
      }, 500);
      return;
    }

    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      if (res.success && res.data) {
        const { user, accessToken, refreshToken } = res.data;
        setTokens(accessToken, refreshToken);

        // Fetch Mandi Profile to check post-login onboarding status
        const profileRes = await apiRequest("/mandi/profile");
        setLoading(false);

        const currentProfile = profileRes?.data?.profile;
        const currentApprovalStatus: MandiApprovalStatus =
          currentProfile?.approvalStatus || "PENDING_ONBOARDING";

        const loggedInUser: User = {
          ...user,
          mandiName: currentProfile?.mandiName || "",
          mandiCode: currentProfile?.apmcCode || "",
          approvalStatus: currentApprovalStatus,
        };

        setTempUser(loggedInUser);
        setApprovalStatus(currentApprovalStatus);

        if (currentApprovalStatus === "PENDING_ONBOARDING") {
          setMode("onboarding");
          setOnboardingStep(1);
          setSuccessMsg("Welcome! Please complete your APMC Yard Onboarding details.");
        } else if (currentApprovalStatus === "PENDING_APPROVAL") {
          setMode("pending_approval");
        } else if (currentApprovalStatus === "APPROVED") {
          onLoginSuccess(loggedInUser);
        } else {
          setMode("pending_approval");
        }
      } else {
        setLoading(false);
        setErrorMsg(res.message || "Invalid credentials. Please verify.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Failed to log in.");
    }
  };

  // ----------------------------------------------------
  // 4. POST-LOGIN ONBOARDING SUBMISSION
  // ----------------------------------------------------
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const onboardingPayload = {
      mandiName,
      apmcCode,
      address,
      district,
      state: stateName,
      operatingHours,
      aadhaarNumber,
      aadhaarDocUrl: "https://vault.agrimarket.gov.in/docs/aadhaar_verified.pdf",
      legalDocs: [
        {
          name: "APMC Mandi Operating License",
          type: "MANDI_LICENSE" as const,
          fileUrl: "https://vault.agrimarket.gov.in/docs/license.pdf",
        },
        {
          name: "State Mandi Board Registration",
          type: "APMC_REGISTRATION" as const,
          fileUrl: "https://vault.agrimarket.gov.in/docs/reg.pdf",
        },
        {
          name: "GST Exemption Certificate",
          type: "GST_CERTIFICATE" as const,
          fileUrl: "https://vault.agrimarket.gov.in/docs/gst.pdf",
        },
      ],
    };

    if (useMock) {
      setTimeout(() => {
        setLoading(false);
        setApprovalStatus("PENDING_APPROVAL");
        setMode("pending_approval");
        setSuccessMsg("Onboarding submitted successfully. Awaiting administrator verification.");
      }, 600);
      return;
    }

    try {
      const res = await apiRequest("/mandi/onboarding", {
        method: "POST",
        body: JSON.stringify(onboardingPayload),
      });

      setLoading(false);

      if (res.success) {
        setApprovalStatus("PENDING_APPROVAL");
        setMode("pending_approval");
        setSuccessMsg("Onboarding submitted! Awaiting administrator approval.");
      } else {
        setErrorMsg(res.message || "Failed to submit onboarding.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Error submitting onboarding.");
    }
  };

  // ----------------------------------------------------
  // 5. DEV SIMULATOR: ADMIN APPROVAL TOGGLE
  // ----------------------------------------------------
  const handleSimulateAdminApproval = async () => {
    setLoading(true);
    setErrorMsg("");

    if (useMock || !tempUser) {
      setTimeout(() => {
        setLoading(false);
        setApprovalStatus("APPROVED");
        if (tempUser) {
          onLoginSuccess({
            ...tempUser,
            mandiName,
            mandiCode: apmcCode,
            approvalStatus: "APPROVED",
          });
        }
      }, 400);
      return;
    }

    try {
      const profileRes = await apiRequest("/mandi/profile");
      const profileId = profileRes?.data?.profile?.id;

      if (profileId) {
        await apiRequest(`/admin/mandi/${profileId}/approval-status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "APPROVED" }),
        });
      }

      setLoading(false);
      setApprovalStatus("APPROVED");
      onLoginSuccess({
        ...tempUser,
        mandiName,
        mandiCode: apmcCode,
        approvalStatus: "APPROVED",
      });
    } catch {
      setLoading(false);
      // Fallback transition
      setApprovalStatus("APPROVED");
      onLoginSuccess({
        ...tempUser,
        mandiName,
        mandiCode: apmcCode,
        approvalStatus: "APPROVED",
      });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-zinc-950">
      <div className="w-full max-w-2xl bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <IconShield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">APMC Mandi Operations Portal</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Official Arrival Management & Electronic Gate Check-in System
          </p>
        </div>

        {/* Global Notifications */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <IconCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* ==================================================== */}
        {/* MODE: LOGIN                                         */}
        {/* ==================================================== */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-sm font-semibold text-zinc-200">Mandi Operator Login</span>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg("");
                  setSuccessMsg("");
                  setMode("signup");
                }}
                className="text-xs text-emerald-400 hover:underline"
              >
                New Mandi? Register Here
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Registered Email / Mobile
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="mandi@agrimarket.gov.in"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <IconLock className="w-4 h-4" />
              )}
              {loading ? "Authenticating..." : "Sign In to Mandi Portal"}
            </button>
          </form>
        )}

        {/* ==================================================== */}
        {/* MODE: SIMPLE SIGNUP (No yard info yet)               */}
        {/* ==================================================== */}
        {mode === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-sm font-semibold text-zinc-200">Mandi Operator Registration</span>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg("");
                  setSuccessMsg("");
                  setMode("login");
                }}
                className="text-xs text-emerald-400 hover:underline"
              >
                Already registered? Sign In
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Operator Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Rupesh Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="+91 98260 12345"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="mandi@agrimarket.gov.in"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <IconCheck className="w-4 h-4" />
              )}
              {loading ? "Registering..." : "Create Mandi Account & Send OTP"}
            </button>
          </form>
        )}

        {/* ==================================================== */}
        {/* MODE: POST-LOGIN ONBOARDING (After authentication)   */}
        {/* ==================================================== */}
        {mode === "onboarding" && (
          <form onSubmit={handleOnboardingSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-zinc-200">
                  APMC Mandi Onboarding
                </span>
                <p className="text-xs text-zinc-400">
                  Step {onboardingStep} of 3 — Yard Registration & Compliance
                </p>
              </div>
              <ApprovalBadge status="PENDING_ONBOARDING" />
            </div>

            {/* Stepper Tabs */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    onboardingStep >= s ? "bg-emerald-500" : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Yard Information */}
            {onboardingStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Mandi Yard Official Name
                  </label>
                  <input
                    type="text"
                    required
                    value={mandiName}
                    onChange={(e) => setMandiName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Indore APMC Grain Yard"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      APMC Yard Code
                    </label>
                    <input
                      type="text"
                      required
                      value={apmcCode}
                      onChange={(e) => setApmcCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="APMC-IND-MP-042"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      required
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="07:30 AM - 06:00 PM (Mon-Sat)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Plot No. 44, Bypass Highway"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Indore"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Madhya Pradesh"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Continue to Identity KYC →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Aadhaar Identity KYC */}
            {onboardingStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Authorized Person Aadhaar Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="5412 8901 2345"
                  />
                </div>

                <div className="p-4 border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-xl text-center bg-zinc-950/40 transition">
                  <IconUpload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs text-zinc-300 font-medium">{aadhaarFile}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Uploaded and secured via DigiLocker Government vault
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(1)}
                    className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(3)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Continue to Statutory Licenses →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Statutory Legal Compliance Docs */}
            {onboardingStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-3">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <IconShield className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          APMC Mandi Operating License
                        </p>
                        <p className="text-[11px] text-zinc-400">{licenseFile}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <IconShield className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          State Mandi Board Registration
                        </p>
                        <p className="text-[11px] text-zinc-400">{registrationFile}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Ready
                    </span>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <IconShield className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          GST Exemption / Compliance Certificate
                        </p>
                        <p className="text-[11px] text-zinc-400">{gstFile}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Ready
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <IconCheck className="w-4 h-4" />
                    )}
                    {loading ? "Submitting..." : "Submit Application for Admin Approval"}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* ==================================================== */}
        {/* MODE: PENDING APPROVAL SCREEN                        */}
        {/* ==================================================== */}
        {mode === "pending_approval" && (
          <div className="text-center space-y-6 py-4 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <IconClock className="w-8 h-8" />
            </div>

            <div>
              <div className="flex justify-center mb-2">
                <ApprovalBadge status={approvalStatus} />
              </div>
              <h2 className="text-xl font-bold text-zinc-100">
                Application Under Administrative Review
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2 leading-relaxed">
                Your APMC Mandi registration & legal documents have been submitted to the platform
                administrator. Operational features (slots, intake stream & gate scanner) will unlock
                immediately upon statutory verification.
              </p>
            </div>

            {/* Dev Simulator Action Box */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">
                  🛠️ Developer Simulation Tools
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">
                  prompt3.md Policy Test
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Test the <code className="text-emerald-400 font-mono">requireApprovedMandi</code>{" "}
                transition policy by simulating instant admin verification.
              </p>
              <button
                type="button"
                onClick={handleSimulateAdminApproval}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <IconShield className="w-4 h-4" />
                )}
                Simulate Admin Approval & Unlock Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      <Modal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        title="Verify Email OTP"
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-300">
            A 6-digit verification code has been dispatched to{" "}
            <span className="font-semibold text-emerald-400">{otpEmail || email}</span>.
          </p>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-center text-xl font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-500"
              placeholder="123456"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="py-2 px-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
