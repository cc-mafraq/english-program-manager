import {
  Box,
  BoxProps,
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormHelperText,
  useTheme,
} from "@mui/material";
import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../hooks";

interface LabeledCheckboxProps {
  checkboxProps?: CheckboxProps;
  containerProps?: BoxProps;
  errorName?: string;
  label: string;
  name?: string;
}

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  checkboxProps,
  label,
  name,
  containerProps,
  errorName,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const theme = useTheme();
  const { name: nameFallback, errorMessage } = useInput(
    label,
    errors as FieldError,
    errorName ?? name,
  );
  const errorColor = errorMessage ? theme.palette.error.main : undefined;

  return (
    <Box marginTop={-1} {...containerProps}>
      <FormControlLabel
        control={
          <Checkbox
            sx={{ color: errorColor }}
            {...checkboxProps}
            {...register(name ?? nameFallback)}
          />
        }
        label={label}
        sx={{ color: errorColor }}
      />
      <FormHelperText error={!!errorMessage}>{errorMessage}</FormHelperText>
    </Box>
  );
};

LabeledCheckbox.defaultProps = {
  checkboxProps: undefined,
  containerProps: undefined,
  errorName: undefined,
  name: undefined,
};
