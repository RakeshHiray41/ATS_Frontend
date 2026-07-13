import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import type { Role } from "../api/auth";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const fallback = role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
