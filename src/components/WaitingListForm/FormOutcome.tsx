import { useMediaQuery, useTheme } from "@mui/material";
import { values } from "lodash";
import React from "react";
import { WaitlistOutcome } from "../../interfaces";
import { SPACING } from "../../services";
import { FormLabel, GridContainer, GridItemAutocomplete, GridItemDatePicker } from "../reusables";

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
        <GridItemDatePicker datePickerProps={{ disabled }} label="Transfer DB Date" name="transferDbDate" />
      </GridContainer>
    </>
  );
};
