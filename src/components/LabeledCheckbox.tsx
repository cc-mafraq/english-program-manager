import { Box, BoxProps, Checkbox, CheckboxProps, FormControlLabel } from "@mui/material";
import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../hooks";

interface LabeledCheckboxProps {
  checkboxProps?: CheckboxProps;
  containerProps?: BoxProps;
  label: string;
  name?: string;
}

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  checkboxProps,
  label,
  name,
  containerProps,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { name: nameFallback } = useInput(label, errors as FieldError);

  return (
    <Box marginTop={-1} {...containerProps}>
      <FormControlLabel
        control={<Checkbox {...checkboxProps} />}
        label={label}
        {...register(name ?? nameFallback)}
      />
    </Box>
  );
};

LabeledCheckbox.defaultProps = {
  checkboxProps: undefined,
  containerProps: undefined,
  name: undefined,
};
