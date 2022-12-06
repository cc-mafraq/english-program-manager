import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAppStore } from ".";
import { app, db } from "../services";

export const useRole = () => {
  const setRole = useAppStore((state) => {
    return state.setRole;
  });
  const email = getAuth(app).currentUser?.email || "email";
  const [document] = useDocumentData(doc(db, "whitelist", email));
  useEffect(() => {
    setRole(document?.role);
  }, [document?.role, setRole]);
};
