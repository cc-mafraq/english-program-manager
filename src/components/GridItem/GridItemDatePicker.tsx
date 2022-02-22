import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { Grid, GridProps, StandardTextFieldProps, TextField } from "@mui/material";
import { Moment } from "moment";
import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../../hooks/useInput";

interface GridItemDatePickerProps {
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
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(label, errors as FieldError, name);
  const [dateValue, setDateValue] = React.useState<Moment | null>(value || null);

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
                error={!!errorMessage}
                fullWidth
                label={label}
                {...textFieldProps}
                helperText={errorMessage}
                variant="outlined"
                {...params}
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
  gridProps: undefined,
  name: undefined,
  textFieldProps: undefined,
  value: undefined,
};
