import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { GridContainer, GridItemTextField, LabeledCheckbox, StudentFormLabel } from "..";
import { Student } from "../../../interfaces";
import { SPACING } from "../../../services";

export const FormLiteracyAndZoom: React.FC = () => {
  const { watch } = useFormContext<Student>();

  return (
    <>
      <Grid container>
        <Grid item xs>
          <StudentFormLabel textProps={{ marginTop: SPACING }}>Literacy</StudentFormLabel>
        </Grid>
        <Grid item xs>
          <StudentFormLabel textProps={{ marginTop: SPACING }}>Zoom</StudentFormLabel>
        </Grid>
      </Grid>
      <GridContainer>
        <Grid item xs>
          <LabeledCheckbox
            containerProps={{ marginTop: -1 }}
            label="Illiterate - AR"
            name="literacy.illiterateAr"
          />
          <LabeledCheckbox
            containerProps={{ marginTop: -1 }}
            label="Illiterate - ENG"
            name="literacy.illiterateEng"
          />
          {watch("literacy.illiterateEng") && (
            <GridItemTextField
              gridProps={{ paddingRight: SPACING, paddingTop: SPACING / 2 }}
              label="Tutor and Date"
              name="literacy.tutorAndDate"
            />
          )}
        </Grid>
        <Grid item xs>
          <GridItemTextField
            label="Tutor / Club and Details"
            name="zoom"
            textFieldProps={{ multiline: true, rows: 4 }}
          />
        </Grid>
      </GridContainer>
    </>
  );
};
