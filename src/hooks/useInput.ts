import { camelCase, get } from "lodash";
import { DeepMap, FieldError } from "react-hook-form";

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>, nameProp?: string) => {
  const name = camelCase(label);
  const errorMessage = get(errors, nameProp ?? name)?.message;
  return { errorMessage, name };
};
