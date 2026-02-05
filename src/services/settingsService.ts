import { collection, deleteDoc, doc } from "firebase/firestore";
import { object, string } from "yup";
import { Roles } from "../interfaces";
import { db } from "./firebaseService";

export const whiteListEntrySchema = object().shape({
  email: string().email().required(),
  role: string().oneOf(Object.values(Roles)).nullable().required(),
});

export const deleteWhiteListEntry = async (email: string) => {
  await deleteDoc(doc(collection(db, "whitelist"), email));
};
