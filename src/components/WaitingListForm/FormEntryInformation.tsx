import { Grid } from "@mui/material";
import { values } from "lodash";
import moment from "moment";
import React from "react";
import { CovidStatus, covidStatuses, HighPriority, WaitlistOutcome, WaitlistStatus } from "../../interfaces";
import { MOMENT_FORMAT, SPACING } from "../../services";
import {
  FormLabel,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
} from "../reusables";

export const FormEntryInformation: React.FC = () => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Entry Information</FormLabel>
      <GridContainer marginBottom={0}>
        <Grid item xs={2}>
          <LabeledCheckbox checkboxProps={{ defaultChecked: true }} label="Waiting" name="waiting" />
        </Grid>
        <GridItemDatePicker label="Entry Date" name="entryDate" value={moment().format(MOMENT_FORMAT)} />
        <GridItemAutocomplete
          defaultValue={HighPriority.NO}
          label="High Priority"
          name="highPriority"
          options={[HighPriority.NO, HighPriority.YES, HighPriority.PAST]}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Name (Optional)" name="name" />
        <GridItemTextField label="Referral" name="referral" />
      </GridContainer>
      <GridContainer marginBottom={0}>
        <Grid item xs={2}>
          <LabeledCheckbox label="Entered in Phone" name="enteredInPhone" />
        </Grid>
        <GridItemAutocomplete
          defaultValue={WaitlistStatus.POT}
          label="Status"
          name="status"
          options={values(WaitlistStatus)}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Number of People" name="numPeople" value="1" />
        <GridItemAutocomplete
          defaultValue={CovidStatus.NORPT}
          label="Vaccine Status"
          name="covidStatus"
          options={covidStatuses}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Vaccine Notes" name="covidVaccineNotes" />
      </GridContainer>
      <GridContainer marginBottom={SPACING}>
        <Grid item xs={2}>
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Probable PL1" name="probPL1" />
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Probable L3+" name="probL3Plus" />
        </Grid>
        <GridItemAutocomplete
          autoSelect={false}
          label="Outcome"
          name="outcome"
          options={values(WaitlistOutcome)}
        />
        <GridItemTextField label="Transferral Database" name="transferralAndDate.transferral" />
        <GridItemDatePicker label="Transferral Date" name="transferralAndDate.date" />
        <Grid item xs />
      </GridContainer>
    </>
  );
};
