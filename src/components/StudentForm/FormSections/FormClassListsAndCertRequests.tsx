import { Grid } from "@mui/material";
import React from "react";
import {
  GridContainer,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
  StudentFormLabel,
} from "..";
import { SPACING } from "../../../services";

export const FormClassListsAndCertRequests: React.FC = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={7}>
          <StudentFormLabel textProps={{ marginTop: SPACING }}>Class Lists</StudentFormLabel>
        </Grid>
        <Grid item marginLeft={SPACING} xs>
          <StudentFormLabel textProps={{ marginTop: SPACING }}>
            Certificate Requests
          </StudentFormLabel>
        </Grid>
      </Grid>
      <GridContainer>
        <Grid item xs={1}>
          <LabeledCheckbox label="Sent" name="classList.classListSent" />
        </Grid>
        <GridItemDatePicker
          gridProps={{ xs: 3 }}
          label="Class List Date"
          name="classList.classListSentDate"
        />
        <GridItemTextField
          gridProps={{ xs: 3 }}
          label="Class List Notes"
          name="classList.classListSentNotes"
        />
        <GridItemTextField label="Request and Date" name="certificateRequests" />
      </GridContainer>
    </>
  );
};
