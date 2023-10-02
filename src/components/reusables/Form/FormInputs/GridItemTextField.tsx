import { Grid, GridProps, StandardTextFieldProps, TextField } from "@mui/material";
import { omit } from "lodash";
import React, { useMemo } from "react";
import { FieldErrorsImpl, useFormContext } from "react-hook-form";
import { useInput } from "../../../../hooks";

interface GridItemTextField {
  gridProps?: GridProps;
  label: string;
  name?: string;
  textFieldProps?: StandardTextFieldProps;
  value?: string;
}

/* A text field to be used on forms */
export const GridItemTextField = ({ label, gridProps, textFieldProps, value, name }: GridItemTextField) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(
    label,
    errors as FieldErrorsImpl<Record<string, unknown>>,
    name,
  );
  const registerRef = useMemo(() => {
    return register(name ?? nameFallback, textFieldProps?.onChange ? { onChange: textFieldProps.onChange } : {});
  }, [name, nameFallback, register, textFieldProps?.onChange]);

  return (
    <Grid item xs {...gridProps}>
      <TextField
        defaultValue={value}
        fullWidth
        label={label}
        {...textFieldProps}
        error={!!errorMessage}
        helperText={errorMessage}
        variant="outlined"
        {...omit(registerRef, "ref")}
        inputRef={registerRef.ref}
      />
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  gridProps: undefined,
  name: undefined,
  textFieldProps: undefined,
  value: "",
};
