import { Grid, GridProps, StandardTextFieldProps, TextField } from "@mui/material";
import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../../../hooks";

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
  const { name: nameFallback, errorMessage } = useInput(label, errors as FieldError, name);

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
        {...register(name ?? nameFallback)}
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
