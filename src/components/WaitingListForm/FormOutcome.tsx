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
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Outcome</FormLabel>
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
