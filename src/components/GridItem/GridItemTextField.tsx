import { Grid, StandardTextFieldProps, TextField } from "@mui/material";
import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../../hooks/useInput";

interface GridItemTextField {
  label: string;
  name?: string;
  textFieldProps?: StandardTextFieldProps;
  value?: string;
}

/* A text field to be used on forms */
export const GridItemTextField = ({ label, textFieldProps, value, name }: GridItemTextField) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(label, errors as FieldError);

  return (
    <Grid container direction="column" item xs>
      <Grid item xs>
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
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  name: undefined,
  textFieldProps: undefined,
  value: "",
};
