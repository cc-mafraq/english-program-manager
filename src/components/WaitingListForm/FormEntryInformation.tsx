import { Grid } from "@mui/material";
import moment from "moment";
import React from "react";
import { HighPriority } from "../../interfaces";
import { MOMENT_FORMAT, SPACING } from "../../services";
import {
  FormLabel,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
} from "../reusables";

interface FormEntryInformationProps {
  disabled: boolean;
}

export const FormEntryInformation: React.FC<FormEntryInformationProps> = ({ disabled }) => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Entry Information</FormLabel>
      <GridContainer marginBottom={0}>
        <Grid item xs={2}>
          <LabeledCheckbox checkboxProps={{ defaultChecked: true, disabled }} label="Waiting" name="waiting" />
        </Grid>
        <GridItemDatePicker
          datePickerProps={{ disabled }}
          gridProps={{ xs: 3 }}
          label="Entry Date"
          name="entryDate"
          value={moment().format(MOMENT_FORMAT)}
        />
        <GridItemAutocomplete
          defaultValue={HighPriority.NO}
          disabled={disabled}
          gridProps={{ xs: 3 }}
          label="High Priority"
          name="highPriority"
          options={[HighPriority.NO, HighPriority.YES, HighPriority.PAST]}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Name (Optional)" name="name" />
      </GridContainer>
      <GridContainer>
        <Grid item xs={2}>
          <LabeledCheckbox checkboxProps={{ disabled }} label="Entered in Phone" name="enteredInPhone" />
        </Grid>
        <GridItemTextField gridProps={{ xs: 3 }} label="Referral" name="referral" />
        <GridItemTextField gridProps={{ xs: 3 }} label="Number of People" name="numPeople" value="1" />
        <Grid item xs={3}>
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Probable PL1" name="probPL1" />
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Probable L3+" name="probL3Plus" />
        </Grid>
      </GridContainer>
    </>
  );
};
