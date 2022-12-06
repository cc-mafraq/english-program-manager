import { getAuth } from "firebase/auth";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks";
import { app } from "../services";

interface AuthorizationProps {
  children: React.ReactNode;
}

export const Authorization: React.FC<AuthorizationProps> = ({ children }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, authLoading] = useAuthState(auth);
  useRole();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  return <>{children}</>;
};
