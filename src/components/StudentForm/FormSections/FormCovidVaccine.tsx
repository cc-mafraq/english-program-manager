import { Grid } from "@mui/material";
import moment from "moment";
import React from "react";
import { GridContainer, GridItemAutocomplete, StudentFormLabel } from "../..";
import { CovidStatus, covidStatuses } from "../../../interfaces";
import { MOMENT_FORMAT, SPACING } from "../../../services";
import { GridItemDatePicker, GridItemTextField, LabeledCheckbox } from "../FormInputs";

export const FormCovidVaccine: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>COVID Vaccine</StudentFormLabel>
      <GridContainer>
        <GridItemAutocomplete
          defaultValue={CovidStatus.FULL}
          label="Vaccine Status"
          name="covidVaccine.status"
          options={covidStatuses}
        />
        <GridItemDatePicker label="Date" name="covidVaccine.date" value={moment().format(MOMENT_FORMAT)} />
        <GridItemTextField label="Reason" name="covidVaccine.reason" />
        <Grid item marginTop={-SPACING * 1.5}>
          <LabeledCheckbox label="Suspected Fraud" name="covidVaccine.suspectedFraud" />
          <GridItemTextField label="Suspected Fraud Reason" name="covidVaccine.suspectedFraudReason" />
        </Grid>
      </GridContainer>
    </>
  );
};
