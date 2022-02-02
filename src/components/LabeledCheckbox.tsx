import { Checkbox, CheckboxProps, FormControlLabel } from "@mui/material";
import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../hooks";

interface LabeledCheckboxProps {
  checkboxProps?: CheckboxProps;
  label: string;
  name?: string;
}

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({ checkboxProps, label, name }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { name: nameFallback } = useInput(label, errors as FieldError);

  return (
    <FormControlLabel
      control={<Checkbox {...checkboxProps} />}
      label={label}
      {...register(name ?? nameFallback)}
    />
  );
};

LabeledCheckbox.defaultProps = {
  checkboxProps: undefined,
  name: undefined,
};
