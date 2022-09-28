import { Grid } from "@mui/material";
import moment from "moment";
import React from "react";
import { withdrawReasons } from "../../../interfaces";
import { MOMENT_FORMAT, SPACING } from "../../../services";
import {
  FormLabel,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  LabeledCheckbox,
} from "../../reusables";

export const FormWithdraw: React.FC = () => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Withdraw Student</FormLabel>
      <GridContainer marginBottom={SPACING}>
        <Grid item>
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Invite" name="inviteTag" />
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="NCL" name="noContactList" />
        </Grid>
        <GridItemDatePicker
          label="Withdraw Date"
          name="withdrawDate"
          textFieldProps={{ required: true }}
          value={moment().format(MOMENT_FORMAT)}
        />
        <GridItemAutocomplete
          autoSelect={false}
          label="Withdraw Reason"
          name="droppedOutReason"
          options={withdrawReasons}
        />
      </GridContainer>
    </>
  );
};
