import {
  Autocomplete,
  AutocompleteProps,
  Grid,
  GridProps,
  StandardTextFieldProps,
  TextField,
} from "@mui/material";
import { omit } from "lodash";
import React from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { useInput } from "../../../hooks";

interface GridItemAutocomplete {
  defaultValue?: string[] | string;
  gridProps?: GridProps;
  label: string;
  name?: string;
  textFieldProps?: StandardTextFieldProps;
}

/* A text field to be used on forms */
export const GridItemAutocomplete = (
  props: GridItemAutocomplete & Omit<AutocompleteProps<unknown, boolean, boolean, boolean>, "renderInput">,
) => {
  const { label, name, gridProps, defaultValue, textFieldProps } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(label, errors as FieldError, name);

  return (
    <Grid item xs {...gridProps}>
      <Controller
        control={control}
        defaultValue={defaultValue || null}
        name={name ?? nameFallback}
        render={({ field }) => {
          return (
            <Autocomplete
              autoSelect
              openOnFocus
              renderInput={(params) => {
                return (
                  <TextField
                    label={label}
                    {...params}
                    error={!!errorMessage}
                    helperText={errorMessage}
                    variant="outlined"
                    {...textFieldProps}
                  />
                );
              }}
              {...omit(props, ["gridProps", "textFieldProps"])}
              {...omit(field, ["onChange"])}
              onChange={(e, data) => {
                return field.onChange(data);
              }}
            />
          );
        }}
      />
    </Grid>
  );
};

GridItemAutocomplete.defaultProps = {
  defaultValue: undefined,
  gridProps: undefined,
  name: undefined,
  textFieldProps: undefined,
};
