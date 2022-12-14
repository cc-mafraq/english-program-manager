import React from "react";
import { CovidStatus, covidStatuses } from "../../interfaces";
import { SPACING } from "../../services";
import { FormLabel, GridContainer, GridItemAutocomplete, GridItemTextField } from "../reusables";

interface FormWaitingListVaccineProps {
  disabled: boolean;
}

export const FormWaitingListVaccine: React.FC<FormWaitingListVaccineProps> = ({ disabled }) => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>COVID Vaccine</FormLabel>
      <GridContainer marginBottom={SPACING}>
        <GridItemAutocomplete
          defaultValue={CovidStatus.NORPT}
          disabled={disabled}
          label="Vaccine Status"
          name="covidStatus"
          options={covidStatuses}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Vaccine Notes" name="covidVaccineNotes" textFieldProps={{ disabled }} />
      </GridContainer>
    </>
  );
};
