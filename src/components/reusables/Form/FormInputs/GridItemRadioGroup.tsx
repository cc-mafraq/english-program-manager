import { Clear } from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  GridProps,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller, FieldErrorsImpl, useFormContext } from "react-hook-form";
import { useInput } from "../../../../hooks";

interface GridItemRadioGroup {
  defaultValue?: string;
  gridProps?: GridProps;
  label?: string;
  name?: string;
  options: string[];
}

/* Renders a group of radio buttons for a form.
Ref: https://stackoverflow.com/questions/64042394/react-hook-form-and-material-ui-formcontrol */
export const GridItemRadioGroup = ({ defaultValue, gridProps, label, name, options }: GridItemRadioGroup) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(
    label ?? "",
    errors as FieldErrorsImpl<Record<string, unknown>>,
    name,
  );
  const theme = useTheme();
  const errorColor = errorMessage ? theme.palette.error.main : undefined;

  return (
    <Grid item xs {...gridProps}>
      <FormControl component="fieldset" error={!!errorMessage}>
        {label ? <FormLabel component="legend">{label}</FormLabel> : <></>}
        <Controller
          control={control}
          defaultValue={defaultValue || null}
          name={name ?? nameFallback}
          render={({ field: { onChange, onBlur, ref, value } }) => {
            return (
              <RadioGroup sx={{ flexDirection: "row" }} value={value}>
                {options.map((opt) => {
                  return (
                    <FormControlLabel
                      key={opt}
                      control={
                        <Radio inputRef={ref} onBlur={onBlur} onChange={onChange} sx={{ color: errorColor }} />
                      }
                      label={opt}
                      sx={{ color: errorColor }}
                      value={opt}
                    />
                  );
                })}
              </RadioGroup>
            );
          }}
        />
        <FormHelperText>{errorMessage}</FormHelperText>
      </FormControl>
      <Tooltip arrow title="Clear">
        <IconButton
          onClick={() => {
            setValue(name ?? nameFallback, null);
          }}
        >
          <Clear />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};

GridItemRadioGroup.defaultProps = {
  defaultValue: undefined,
  gridProps: undefined,
  label: undefined,
  name: undefined,
};
