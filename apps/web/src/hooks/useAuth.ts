import { useEffect, useState } from "react";
import { api } from "../api/client";
import { logout } from "../services/authService";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();

    const handleAuthChange = () => {
      fetchMe();
    };

    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const roles =
    user?.user_roles
      ?.map((ur: any) => ur?.role?.name)
      .filter(Boolean) || [];

  return {
    user,
    loading,
    roles,
    isLoggedIn: !!user,
    isSeeker: roles.includes("SEEKER"),
    isDevotee: roles.includes("DEVOTEE"),
    isAdmin: roles.includes("ADMIN"),
    isSuperAdmin: roles.includes("SUPER_ADMIN"),
    logout: handleLogout,
    refetch: fetchMe,
  };
}