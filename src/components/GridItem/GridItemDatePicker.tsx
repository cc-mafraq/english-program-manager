import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { Grid, GridProps, StandardTextFieldProps, TextField, useTheme } from "@mui/material";
import { omit } from "lodash";
import { Moment } from "moment";
import React from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../../hooks/useInput";

interface GridItemDatePickerProps {
  errorName?: string;
  gridProps?: GridProps;
  label: string;
  name?: string;
  textFieldProps?: StandardTextFieldProps;
  value?: Moment | null;
}

/* A date picker to be used on forms */
export const GridItemDatePicker: React.FC<GridItemDatePickerProps> = ({
  label,
  gridProps,
  textFieldProps,
  value,
  name,
  errorName,
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(
    label,
    errors as FieldError,
    errorName ?? name,
  );
  const theme = useTheme();
  const errorColor = errorMessage ? theme.palette.error.main : undefined;

  return (
    <Grid item xs {...gridProps}>
      <Controller
        control={control}
        defaultValue={value || null}
        name={name ?? nameFallback}
        render={({ field }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                {...field}
                label={label}
                renderInput={(params) => {
                  return (
                    <TextField
                      error={!!errorMessage}
                      fullWidth
                      helperText={errorMessage}
                      label={label}
                      sx={{
                        svg: { color: errorColor },
                      }}
                      variant="outlined"
                      {...textFieldProps}
                      {...omit(params, ["error"])}
                    />
                  );
                }}
              />
            </LocalizationProvider>
          );
        }}
      />
    </Grid>
  );
};

GridItemDatePicker.defaultProps = {
  errorName: undefined,
  gridProps: undefined,
  name: undefined,
  textFieldProps: undefined,
  value: undefined,
};
