import { getAuth } from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { AppContext } from "../App";
import { useRole } from "../hooks";
import { app } from "../services";

interface AuthorizationProps {
  children: React.ReactNode;
}

export const Authorization: React.FC<AuthorizationProps> = ({ children }) => {
  const store = useContext(AppContext);
  const role = useStore(store, (state) => {
    return state.role;
  });
  const setRole = useStore(store, (state) => {
    return state.setRole;
  });
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, authLoading] = useAuthState(auth);
  const globalRole = useRole();

  // TODO: subscribe with role selector
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
