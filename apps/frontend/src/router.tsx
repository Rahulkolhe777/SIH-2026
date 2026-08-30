import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { MandiDashboard } from "./pages/MandiDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RouteErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteErrorBoundary />,
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    errorElement: <RouteErrorBoundary />,
    element: <LoginPage />,
  },
  {
    path: "/register",
    errorElement: <RouteErrorBoundary />,
    element: <RegisterPage />,
  },
  {
    path: "/farmer/dashboard",
    errorElement: <RouteErrorBoundary />,
    element: (
      <ProtectedRoute allowedRoles={["FARMER"]}>
        <FarmerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mandi/dashboard",
    errorElement: <RouteErrorBoundary />,
    element: (
      <ProtectedRoute allowedRoles={["MANDI_OPERATOR"]}>
        <MandiDashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;
