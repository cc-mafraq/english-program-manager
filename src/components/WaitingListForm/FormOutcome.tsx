import { useMediaQuery, useTheme } from "@mui/material";
import { values } from "lodash";
import React from "react";
import { WaitlistOutcome } from "../../interfaces";
import { SPACING } from "../../services";
import {
  FormLabel,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
} from "../reusables";

interface FormOutcomeProps {
  disabled: boolean;
}

export const FormOutcome: React.FC<FormOutcomeProps> = ({ disabled }) => {
  const theme = useTheme();
  const greaterThanMedium = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <FormLabel textProps={{ marginTop: greaterThanMedium ? SPACING : 0 }}>Outcome</FormLabel>
      <GridContainer marginBottom={SPACING}>
        <GridItemAutocomplete
          autoSelect={false}
          disabled={disabled}
          label="Outcome"
          name="outcome"
          options={values(WaitlistOutcome)}
        />
        <GridItemTextField
          label="Transferral Database"
          name="transferralAndDate.transferral"
          textFieldProps={{ disabled }}
        />
        <GridItemDatePicker
          datePickerProps={{ disabled }}
          label="Transferral Date"
          name="transferralAndDate.date"
        />
      </GridContainer>
    </>
  );
};
