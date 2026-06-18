import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AppLoader from "../components/common/AppLoader";

export default function RoleRoute({
  allowedRoles,
}: {
  allowedRoles: string[];
}) {
  const location = useLocation();

  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <AppLoader
        title="Checking Access"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasAccess = allowedRoles.some((role) => roles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}