import { getAuth } from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks";
import { AppContext } from "../interfaces";
import { app } from "../services";

interface AuthorizationProps {
  children: React.ReactNode;
}

export const Authorization: React.FC<AuthorizationProps> = ({ children }) => {
  const {
    appState: { role },
    appDispatch,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, authLoading] = useAuthState(auth);
  const globalRole = useRole();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
    } else if (role !== globalRole) {
      appDispatch({ payload: { role: globalRole } });
    }
  }, [user, authLoading, navigate, globalRole, appDispatch, role]);

  return <>{children}</>;
};
