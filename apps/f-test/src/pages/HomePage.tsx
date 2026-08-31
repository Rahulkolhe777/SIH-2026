import React, { useState, useEffect } from "react";
import { Sprout, Store, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Badge } from "../components/ui/badge.js";
import { executeApiRequest } from "../services/apiClient.js";

interface HomePageProps {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
}

export function HomePage({ onNavigate, isLoggedIn }: HomePageProps): React.JSX.Element {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    executeApiRequest({ method: "GET", endpoint: "/health" })
      .then((res) => setBackendOnline(res.ok))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-4 py-16 sm:py-24 text-center">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs border border-slate-200 bg-white shadow-2xs">
            <span
              className={`h-2 w-2 rounded-full ${
                backendOnline === true
                  ? "bg-emerald-500 shadow-xs"
                  : backendOnline === false
                  ? "bg-red-500"
                  : "bg-amber-500 animate-pulse"
              }`}
            />
            {backendOnline === true
              ? "Backend API Connected (Port 4000)"
              : backendOnline === false
              ? "Backend Offline (Start bun dev in apps/backend)"
              : "Checking Backend API Status..."}
          </Badge>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl max-w-3xl mx-auto">
          Empowering Indian Agriculture with{" "}
          <span className="text-emerald-600">KrishiSetu</span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          A unified, transparent agricultural supply chain connecting farmers, mandi operators, and buyers with real-time price discovery and verified trade settlements.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isLoggedIn ? (
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              onClick={() => onNavigate("dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                onClick={() => onNavigate("register")}
              >
                Register as Farmer / Mandi
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("login")}
              >
                Sign In to Portal
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="w-full max-w-5xl px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
              <Sprout className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              For Farmers
            </h3>
            <p className="text-sm text-slate-500">
              Direct access to multi-mandi rate comparisons, fair price insights, and instant produce listings.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-4 border border-amber-100">
              <Store className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              For Mandi Yards
            </h3>
            <p className="text-sm text-slate-500">
              Automated daily rate updates, lot arrival tracking, and streamlined electronic gate pass issuance.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4 border border-blue-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Verified & Secure
            </h3>
            <p className="text-sm text-slate-500">
              Role-based access control, OTP-verified credentials, and tamper-resistant transaction logging.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
