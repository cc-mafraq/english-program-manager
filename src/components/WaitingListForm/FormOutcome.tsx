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

export const FormOutcome: React.FC = () => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Outcome</FormLabel>
      <GridContainer marginBottom={SPACING}>
        <GridItemAutocomplete
          autoSelect={false}
          label="Outcome"
          name="outcome"
          options={values(WaitlistOutcome)}
        />
        <GridItemTextField label="Transferral Database" name="transferralAndDate.transferral" />
        <GridItemDatePicker label="Transferral Date" name="transferralAndDate.date" />
      </GridContainer>
    </>
  );
};
