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
  GridItemRadioGroup,
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
        <Grid item sm={2} xs={3}>
          <LabeledCheckbox checkboxProps={{ defaultChecked: true, disabled }} label="Waiting" name="waiting" />
          <LabeledCheckbox
            checkboxProps={{ disabled }}
            containerProps={{ marginTop: -1 }}
            label="Eligibile"
            name="eligible"
          />
        </Grid>
        <GridItemDatePicker
          datePickerProps={{ disabled }}
          gridProps={{ md: 3, sm: 3, xs: 9 }}
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
        <GridItemTextField gridProps={{ md: 3, sm: 4, xs: 9 }} label="Name (Optional)" name="name" />
      </GridContainer>
      <GridContainer marginBottom={0}>
        <Grid item sm={2} xs={3}>
          <LabeledCheckbox checkboxProps={{ disabled }} label="Entered in Phone" name="enteredInPhone" />
        </Grid>
        <GridItemTextField gridProps={{ sm: 3, xs: 9 }} label="Referral" name="referral" />
        <GridItemTextField gridProps={{ xs: 3 }} label="Number of People" name="numPeople" value="1" />
        <GridItemRadioGroup gridProps={{ xs: 3 }} label="Gender" options={["M", "F", "Mixed"]} />
      </GridContainer>
      <GridContainer>
        <Grid item sm={3}>
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Probable PL1" name="probPL1" />
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Probable L3+" name="probL3Plus" />
        </Grid>
      </GridContainer>
    </>
  );
};
