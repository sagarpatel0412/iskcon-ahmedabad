import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getToken, logout, saveUser } from "../services/authService";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const token = getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const res = await api.get("/users/me");
      setUser(res.data);
      saveUser(res.data);
    } catch {
      logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const roles = user?.user_roles?.map((ur: any) => ur.role?.name) || [];

  return {
    user,
    loading,
    roles,
    isLoggedIn: !!user,
    isSeeker: roles.includes("SEEKER"),
    isDevotee: roles.includes("DEVOTEE"),
    isAdmin: roles.includes("ADMIN"),
    isSuperAdmin: roles.includes("SUPER_ADMIN"),
    refetch: fetchMe,
  };
}