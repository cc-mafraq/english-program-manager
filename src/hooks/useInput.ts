import { camelCase, get } from "lodash";
import { DeepMap, FieldErrorsImpl } from "react-hook-form";

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(
  label: string,
  errors: DeepMap<T, FieldErrorsImpl<Record<string, unknown>>>,
  nameProp?: string,
) => {
  const name = camelCase(label);
  const errorMessage = get(errors, nameProp ?? name)?.message;
  return { errorMessage, name };
};
