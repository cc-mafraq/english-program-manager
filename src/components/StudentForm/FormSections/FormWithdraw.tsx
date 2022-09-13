import { Grid } from "@mui/material";
import moment from "moment";
import React from "react";
import { GridContainer, GridItemAutocomplete, GridItemDatePicker, LabeledCheckbox, StudentFormLabel } from "..";
import { withdrawReasons } from "../../../interfaces";
import { MOMENT_FORMAT, SPACING } from "../../../services";

export const FormWithdraw: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Withdraw Student</StudentFormLabel>
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
        <GridItemAutocomplete label="Withdraw Reason" name="droppedOutReason" options={withdrawReasons} />
      </GridContainer>
    </>
  );
};
