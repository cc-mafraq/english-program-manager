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

export const FormPlacement: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Placement</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <Grid item xs={2}>
          <LabeledCheckbox label="Pending" name="placement.pending" />
        </Grid>
        <GridItemTextField label="Sections Offered" name="placement.sectionsOffered" />
        <GridItemTextField label="Placement" name="placement.placement" />
      </GridContainer>
      <GridContainer>
        <GridItemDatePicker label="Confirmed Date" name="placement.confDate" />
        <GridItemDatePicker label="Photo Contact" name="placement.photoContact" />
        <GridItemDatePicker
          label="No Answer Class Schedule"
          name="placement.noAnswerClassScheduleDate"
        />
      </GridContainer>
    </>
  );
};
