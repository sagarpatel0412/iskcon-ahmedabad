import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getToken } from "../services/authService";
import AppLoader from "../components/common/AppLoader";

export default function RoleRoute({
  allowedRoles,
}: {
  allowedRoles: string[];
}) {
  const location = useLocation();
  const token = getToken();
  const { loading, roles } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) {
    return (
      <AppLoader
        title="Checking Access"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  const hasAccess = allowedRoles.some((role) => roles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
