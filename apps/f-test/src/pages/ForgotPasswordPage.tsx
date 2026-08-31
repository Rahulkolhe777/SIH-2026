import React, { useState } from "react";
import { KeyRound, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { Label } from "../components/ui/label.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card.js";
import { Alert, AlertDescription } from "../components/ui/alert.js";
import { executeApiRequest } from "../services/apiClient.js";

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps): React.JSX.Element {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await executeApiRequest({
        method: "POST",
        endpoint: "/api/v1/auth/forgot-password",
        body: { email: email.trim().toLowerCase() },
      });

      if (!res.ok) {
        const errData = res.data as any;
        setError(errData?.message || "Failed to send reset code. Please verify your email.");
        return;
      }

      setSuccessMsg("Reset code sent! Check your email and enter the OTP below.");
      setStep("reset");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otp || !newPassword) {
      setError("Please enter both the OTP and your new password.");
      return;
    }

    setLoading(true);
    try {
      const res = await executeApiRequest({
        method: "POST",
        endpoint: "/api/v1/auth/reset-password",
        body: {
          email: email.trim().toLowerCase(),
          token: otp.trim(),
          newPassword,
        },
      });

      if (!res.ok) {
        const errData = res.data as any;
        setError(errData?.message || "Password reset failed. Invalid or expired OTP code.");
        return;
      }

      setSuccessMsg("Password reset successfully! Redirecting to sign in...");
      setTimeout(() => onNavigate("login"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-slate-50/50">
      <Card className="w-full max-w-md border-slate-200 shadow-md bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100 shadow-xs">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</CardTitle>
          <CardDescription className="text-slate-500">
            {step === "request"
              ? "Enter your email address to receive a password reset OTP"
              : "Enter the OTP sent to your email and set a new password"}
          </CardDescription>
        </CardHeader>

        {step === "request" ? (
          <form onSubmit={handleSendOtp}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMsg && (
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{successMsg}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Registered Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send Reset Code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-slate-600 hover:text-slate-900"
                onClick={() => onNavigate("login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMsg && (
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{successMsg}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">Verification OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password (min 8 chars)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    Confirm New Password
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-slate-600 hover:text-slate-900"
                onClick={() => setStep("request")}
              >
                Change Email / Resend
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
