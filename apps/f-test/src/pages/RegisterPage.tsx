import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Sprout,
  Store,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
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

type RegisterRole = "FARMER" | "MANDI_OPERATOR";

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (token: string, refreshToken?: string, role?: string, email?: string, userId?: string) => void;
}

export function RegisterPage({ onNavigate, onLoginSuccess }: RegisterPageProps): React.JSX.Element {
  const [role, setRole] = useState<RegisterRole>("FARMER");
  const [fullName, setFullName] = useState("Ramesh Kisan");
  const [email, setEmail] = useState("ramesh@farmer.com");
  const [password, setPassword] = useState("Password123");
  const [phone, setPhone] = useState("9876543210");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    setLoading(true);
    try {
      const endpoint = role === "FARMER" ? "/api/v1/user/farmer" : "/api/v1/user/mandi";
      const body = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() ? phone.trim() : undefined,
      };

      const res = await executeApiRequest({
        method: "POST",
        endpoint,
        body,
      });

      if (!res.ok) {
        const errData = res.data as any;
        if (errData?.errors && Array.isArray(errData.errors)) {
          const detail = errData.errors.map((err: any) => `${err.field}: ${err.message}`).join(", ");
          setError(`Validation error: ${detail}`);
        } else {
          setError(errData?.message || errData?.error || "Registration failed. Please check your details.");
        }
        return;
      }

      const data = res.data as any;
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      if (accessToken) {
        setSuccessMsg("Account created successfully! Redirecting...");
        const parsed = parseJwtPayload(accessToken);
        setTimeout(() => {
          onLoginSuccess(
            accessToken,
            refreshToken,
            (parsed?.role as string) || data.data?.user?.role || role,
            (parsed?.email as string) || data.data?.user?.email || email,
            (parsed?.userId as string) || data.data?.user?.id
          );
          onNavigate("dashboard");
        }, 1000);
      } else {
        setSuccessMsg("Registration successful! You can now sign in.");
        setTimeout(() => onNavigate("login"), 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 my-6 bg-slate-50/50">
      <Card className="w-full max-w-lg border-slate-200 shadow-md bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create your account</CardTitle>
          <CardDescription className="text-slate-500">
            Join KrishiSetu to connect directly with farmers and mandis
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

            {successMsg && (
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{successMsg}</AlertDescription>
              </Alert>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-slate-800">Select Your Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("FARMER")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3.5 text-xs font-medium transition-all cursor-pointer ${
                    role === "FARMER"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 font-semibold shadow-xs ring-1 ring-emerald-600"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Sprout className="h-5 w-5 text-emerald-600" />
                  Farmer Account
                </button>

                <button
                  type="button"
                  onClick={() => setRole("MANDI_OPERATOR")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3.5 text-xs font-medium transition-all cursor-pointer ${
                    role === "MANDI_OPERATOR"
                      ? "border-amber-600 bg-amber-50/70 text-amber-900 font-semibold shadow-xs ring-1 ring-amber-600"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Store className="h-5 w-5 text-amber-600" />
                  Mandi Operator
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="fullName"
                  placeholder="e.g. Ramesh Kisan"
                  className="pl-9"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
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

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    className="pl-9"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password (min 8 chars, letter & number)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password123"
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
                  Creating Account...
                </>
              ) : (
                <>
                  Register {role === "FARMER" ? "as Farmer" : "as Mandi Operator"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
