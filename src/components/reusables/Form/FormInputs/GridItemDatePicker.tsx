import { Grid, GridProps, StandardTextFieldProps, TextField, useTheme } from "@mui/material";
import { DatePicker, DatePickerProps, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { includes, omit } from "lodash";
import moment from "moment";
import React from "react";
import { Controller, FieldErrorsImpl, useFormContext } from "react-hook-form";
import { useInput } from "../../../../hooks";
import { MOMENT_FORMAT } from "../../../../services";

interface GridItemDatePickerProps {
  datePickerProps?: Partial<DatePickerProps<unknown, unknown>>;
  errorName?: string;
  gridProps?: GridProps;
  label: string;
  name?: string;
  textFieldProps?: StandardTextFieldProps;
  value?: string | null;
}

/* A date picker to be used on forms */
export const GridItemDatePicker: React.FC<GridItemDatePickerProps> = ({
  label,
  gridProps,
  textFieldProps,
  datePickerProps,
  value,
  name,
  errorName,
}) => {
  const {
    formState: { errors },
    control,
    setValue,
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(
    label,
    errors as FieldErrorsImpl<Record<string, unknown>>,
    errorName ?? name,
  );
  const theme = useTheme();
  const errorColor = errorMessage ? theme.palette.error.main : undefined;
  const defaultValueMoment = moment(value, MOMENT_FORMAT);

  return (
    <Grid item xs {...gridProps}>
      <Controller
        control={control}
        defaultValue={defaultValueMoment.isValid() ? defaultValueMoment.format() : null}
        name={name ?? nameFallback}
        render={({ field }) => {
          const dateMoment = moment(field.value, MOMENT_FORMAT);
          if (includes(name, "correspondence") && !dateMoment.isValid() && defaultValueMoment.isValid()) {
            setValue(name ?? nameFallback, value);
          }
          return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                {...field}
                inputFormat="MM/DD/YY"
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
                      {...omit(params, ["error"])}
                      {...textFieldProps}
                    />
                  );
                }}
                value={
                  dateMoment.isValid()
                    ? dateMoment.format()
                    : defaultValueMoment.isValid()
                    ? defaultValueMoment.format()
                    : dateMoment
                }
                {...datePickerProps}
              />
            </LocalizationProvider>
          );
        }}
      />
    </Grid>
  );
};

GridItemDatePicker.defaultProps = {
  datePickerProps: undefined,
  errorName: undefined,
  gridProps: undefined,
  name: undefined,
  textFieldProps: undefined,
  value: undefined,
};
