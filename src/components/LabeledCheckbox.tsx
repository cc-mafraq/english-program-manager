import {
  Box,
  BoxProps,
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormHelperText,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../hooks";

interface LabeledCheckboxProps {
  checkboxProps?: CheckboxProps;
  containerProps?: BoxProps;
  errorName?: string;
  label: string;
  name?: string;
  parentStateIndex?: number;
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
  const [checkboxVal, setCheckboxVal] = useState(false);

  return (
    <Box marginTop={-1} {...containerProps}>
      <FormControlLabel
        control={
          <Checkbox
            {...checkboxProps}
            onChange={(event) => {
              setCheckboxVal(event?.target.checked);
              // setParentState && setParentState(event.target.checked, parentStateIndex ?? -1);
            }}
            sx={{ color: errorColor }}
            value={checkboxVal}
          />
        }
        label={label}
        sx={{ color: errorColor }}
        {...register(name ?? nameFallback)}
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
  parentStateIndex: undefined,
};
