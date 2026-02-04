import { object, string } from "yup";
import { Roles } from "../interfaces";

export const whiteListEntrySchema = object().shape({
  email: string().email().required(),
  role: string().oneOf(Object.values(Roles)).nullable().required(),
});
