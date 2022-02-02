import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from "@mui/material";
import { camelCase } from "lodash";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface GridItemRadioGroup {
  defaultValue?: string;
  label: string;
  name?: string;
  options: string[];
}

/* Renders a group of radio buttons for a form.
Ref: https://stackoverflow.com/questions/64042394/react-hook-form-and-material-ui-formcontrol */
export const GridItemRadioGroup = ({
  defaultValue,
  label,
  name,
  // onChange,
  options,
}: GridItemRadioGroup) => {
  const { control } = useFormContext();

  return (
    <Grid item xs>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <Controller
          control={control}
          defaultValue={defaultValue}
          name={name ?? camelCase(label)}
          render={({ field: { onChange, onBlur, ref } }) => {
            return (
              <RadioGroup sx={{ flexDirection: "row" }}>
                {options.map((opt) => {
                  return (
                    <FormControlLabel
                      key={opt}
                      control={<Radio inputRef={ref} onBlur={onBlur} onChange={onChange} />}
                      label={opt}
                      value={opt}
                    />
                  );
                })}
              </RadioGroup>
            );
          }}
        />
      </FormControl>
    </Grid>
  );
};

GridItemRadioGroup.defaultProps = {
  defaultValue: undefined,
  name: undefined,
};
