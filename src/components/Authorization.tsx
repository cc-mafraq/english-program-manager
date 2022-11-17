import { getAuth } from "firebase/auth";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useAppStore, useRole } from "../hooks";
import { app } from "../services";

interface AuthorizationProps {
  children: React.ReactNode;
}

export const Authorization: React.FC<AuthorizationProps> = ({ children }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const setRole = useAppStore((state) => {
    return state.setRole;
  });
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, authLoading] = useAuthState(auth);
  const globalRole = useRole();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
    } else if (role !== globalRole) {
      setRole(globalRole);
    }
  }, [user, authLoading, navigate, globalRole, role, setRole]);

  return <>{children}</>;
};
