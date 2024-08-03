import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormLabel, GridContainer, GridItemTextField, LabeledCheckbox } from "../../reusables";

export const FormLiteracyAndZoom: React.FC = () => {
  const { watch } = useFormContext<Student>();

  return (
    <>
      <Grid container>
        <Grid item xs>
          <FormLabel textProps={{ marginTop: SPACING }}>Literacy</FormLabel>
        </Grid>
        {/* <Grid item xs>
          <FormLabel textProps={{ marginTop: SPACING }}>Zoom</FormLabel>
        </Grid> */}
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
        {/* <Grid item xs>
          <GridItemTextField
            label="Tutor / Club and Details"
            name="zoom"
            textFieldProps={{ multiline: true, rows: 4 }}
          />
        </Grid> */}
      </GridContainer>
    </>
  );
};
