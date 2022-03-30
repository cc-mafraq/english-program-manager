import { getAuth, signOut } from "firebase/auth";
import { app } from ".";

export const logout = async () => {
  const auth = getAuth(app);
  await signOut(auth);
};
