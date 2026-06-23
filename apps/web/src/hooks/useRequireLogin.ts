import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function useRequireLogin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return () => {
    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: window.location.pathname,
        },
      });

      return false;
    }

    return true;
  };
}