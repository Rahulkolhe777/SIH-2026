import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/authSlice";
import { Sprout, LogOut, Wheat } from "lucide-react";

export function FarmerDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#07140d] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/15 ring-1 ring-green-400/20">
            <Sprout className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Mandi<span className="text-green-400">Connect</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              Farmer Dashboard
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-400/10 px-4 py-1.5 text-xs text-green-300">
            <Wheat className="h-3.5 w-3.5" />
            Farmer Portal
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name ?? "Farmer"} 👋
          </h2>
          <p className="mt-2 text-white/60">
            Your mandi dashboard is ready. Start booking procurement slots and
            tracking your deliveries.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Active Bookings", value: "0", color: "text-green-400" },
            { label: "Pending Slots", value: "0", color: "text-yellow-400" },
            { label: "Completed", value: "0", color: "text-blue-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <p className="text-sm text-white/50">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default FarmerDashboard;
