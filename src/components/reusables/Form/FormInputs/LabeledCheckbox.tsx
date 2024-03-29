import { Box, BoxProps, Checkbox, CheckboxProps, FormControlLabel, FormHelperText, useTheme } from "@mui/material";
import { omit } from "lodash";
import React from "react";
import { Controller, FieldErrorsImpl, useFormContext } from "react-hook-form";
import { useInput } from "../../../../hooks";

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
    control,
    formState: { errors },
  } = useFormContext();
  const theme = useTheme();
  const { name: nameFallback, errorMessage } = useInput(
    label,
    errors as FieldErrorsImpl<Record<string, unknown>>,
    errorName ?? name,
  );
  const errorColor = errorMessage ? theme.palette.error.main : undefined;

  return (
    <Box {...containerProps}>
      <Controller
        control={control}
        defaultValue={checkboxProps?.defaultChecked ?? false}
        name={name ?? nameFallback}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    {...omit(checkboxProps, ["defaultChecked"])}
                    checked={value}
                    inputRef={ref}
                    onBlur={onBlur}
                    onChange={onChange}
                    sx={{ color: errorColor, ...checkboxProps?.sx }}
                  />
                }
                label={label}
                sx={{ color: errorColor }}
              />
              <FormHelperText error={!!errorMessage}>{errorMessage}</FormHelperText>
            </>
          );
        }}
      />
    </Box>
  );
};

LabeledCheckbox.defaultProps = {
  checkboxProps: undefined,
  containerProps: undefined,
  errorName: undefined,
  name: undefined,
};
