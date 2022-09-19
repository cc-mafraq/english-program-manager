import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { app, db } from "../services";

export const useRole = () => {
  const email = getAuth(app).currentUser?.email || "email";
  const [document] = useDocumentData(doc(db, "whitelist", email));
  return document?.role;
};
