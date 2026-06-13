// src/hooks/useCurrentUser.ts
import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { removeAuth } from "../storage/authStorage";

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/users/me");

      setUser(res.data);
    } catch (error) {
      console.log("FETCH USER ERROR:", error);
      setUser(null);
      await removeAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const roles =
    user?.user_roles?.map((ur: any) => ur.role?.name) || [];

  const isSeeker = roles.includes("SEEKER");
  const isDevotee = roles.includes("DEVOTEE");
  const isAdmin = roles.includes("ADMIN");
  const isVerifiedDevotee =
    user?.is_verified_devotee === true && isDevotee;

  return {
    user,
    loading,
    refetchUser: fetchProfile,
    isLoggedIn: !!user,
    roles,
    isSeeker,
    isDevotee,
    isAdmin,
    isVerifiedDevotee,
  };
}