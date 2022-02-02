import { camelCase } from "lodash";
import { DeepMap, FieldError } from "react-hook-form";

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>) => {
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof DeepMap<T, FieldError>] as any)?.message;
  return { errorMessage, name };
};
