import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { Grid, GridProps, StandardTextFieldProps, TextField, useTheme } from "@mui/material";
import { Moment } from "moment";
import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
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
    register,
    formState: { errors },
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(
    label,
    errors as FieldError,
    errorName ?? name,
  );
  const [dateValue, setDateValue] = React.useState<Moment | null>(value || null);
  const theme = useTheme();
  const errorColor = errorMessage ? theme.palette.error.main : undefined;

  return (
    <Grid item xs {...gridProps}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label={label}
          onChange={(newValue) => {
            setDateValue(newValue);
          }}
          renderInput={(params) => {
            return (
              <TextField
                fullWidth
                label={label}
                {...textFieldProps}
                helperText={errorMessage}
                sx={{
                  svg: { color: errorColor },
                }}
                variant="outlined"
                {...params}
                error={!!errorMessage}
                value={dateValue}
                {...register(name ?? nameFallback)}
              />
            );
          }}
          value={dateValue}
        />
      </LocalizationProvider>
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
