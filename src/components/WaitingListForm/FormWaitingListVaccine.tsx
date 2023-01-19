import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { CovidStatus, covidStatuses } from "../../interfaces";
import { SPACING } from "../../services";
import { FormLabel, GridContainer, GridItemAutocomplete, GridItemTextField } from "../reusables";

interface FormWaitingListVaccineProps {
  disabled: boolean;
}

export const FormWaitingListVaccine: React.FC<FormWaitingListVaccineProps> = ({ disabled }) => {
  const theme = useTheme();
  const greaterThanMedium = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>COVID Vaccine</FormLabel>
      <GridContainer marginBottom={greaterThanMedium ? SPACING : 0}>
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
