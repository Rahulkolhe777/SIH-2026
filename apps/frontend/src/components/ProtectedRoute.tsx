import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { Role } from "../interfaces";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth,
  );

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07140d] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-400/30 border-t-green-400" />
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07140d] text-white">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-red-400">
            Access Denied
          </h1>
          <p className="text-white/60">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
