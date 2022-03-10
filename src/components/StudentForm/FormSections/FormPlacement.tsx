import { Grid } from "@mui/material";
import React from "react";
import { GridContainer, GridItemDatePicker, GridItemTextField, LabeledCheckbox, StudentFormLabel } from "..";
import { SPACING } from "../../../services";

export const FormPlacement: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Placement</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemTextField gridProps={{ xs: 6 }} label="Placement" name="placement.placement" />
        <GridItemTextField label="Sections Offered" name="placement.sectionsOffered" />
        <Grid item xs={2}>
          <LabeledCheckbox label="Pending" name="placement.pending" />
        </Grid>
      </GridContainer>
      <GridContainer>
        <GridItemDatePicker gridProps={{ xs: 3 }} label="Class List Sent Date" name="placement.classListSentDate" />
        <GridItemDatePicker
          gridProps={{ xs: 3 }}
          label="No Answer Class Schedule"
          name="placement.noAnswerClassScheduleDate"
        />
        <GridItemDatePicker gridProps={{ xs: 2 }} label="Confirmed Date" name="placement.confDate" />
        <GridItemDatePicker gridProps={{ xs: 2 }} label="Photo Contact" name="placement.photoContact" />
      </GridContainer>
    </>
  );
};
