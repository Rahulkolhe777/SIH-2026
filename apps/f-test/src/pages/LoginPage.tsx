import React, { useState } from "react";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
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
import { executeApiRequest, parseJwtPayload } from "../services/apiClient.js";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (token: string, refreshToken?: string, role?: string, email?: string, userId?: string) => void;
}

export function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps): React.JSX.Element {
  const [email, setEmail] = useState("ramesh@farmer.com");
  const [password, setPassword] = useState("Password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await executeApiRequest({
        method: "POST",
        endpoint: "/api/v1/auth/login",
        body: {
          identifier: email.trim(),
          password,
        },
      });

      if (!res.ok) {
        const errData = res.data as any;
        if (errData?.errors && Array.isArray(errData.errors)) {
          const detail = errData.errors.map((err: any) => `${err.field}: ${err.message}`).join(", ");
          setError(`Validation error: ${detail}`);
        } else {
          setError(errData?.message || errData?.error || "Login failed. Please check your credentials.");
        }
        return;
      }

      const data = res.data as any;
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      if (accessToken) {
        const parsed = parseJwtPayload(accessToken);
        onLoginSuccess(
          accessToken,
          refreshToken,
          (parsed?.role as string) || data.data?.user?.role,
          (parsed?.email as string) || data.data?.user?.email,
          (parsed?.userId as string) || data.data?.user?.id
        );
        onNavigate("dashboard");
      } else {
        setError("Token not received in server response.");
      }
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
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to access your agricultural dashboard & services
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address or Phone</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="text"
                  placeholder="ramesh@farmer.com or phone"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
