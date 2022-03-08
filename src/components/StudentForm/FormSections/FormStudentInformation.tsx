import { Grid } from "@mui/material";
import React from "react";
import {
  GridContainer,
  GridItemAutocomplete,
  GridItemRadioGroup,
  GridItemTextField,
  LabeledCheckbox,
  StudentFormLabel,
} from "..";
import { nationalities } from "../../../interfaces";
import { SPACING } from "../../../services";

export const FormStudentInformation: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Student Information</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemAutocomplete label="Nationality" options={nationalities} />
        <GridItemTextField label="Age" />
        <GridItemTextField label="Occupation" name="work.occupation" />
        <GridItemRadioGroup gridProps={{ xs: 2 }} label="Gender" options={["M", "F"]} />
      </GridContainer>
      <GridContainer>
        <Grid item xs={2}>
          <LabeledCheckbox
            containerProps={{ marginTop: -1 }}
            label="Teacher"
            name="work.isTeacher"
          />
          <LabeledCheckbox
            containerProps={{ marginTop: -1 }}
            label="English Teacher"
            name="work.isEnglishTeacher"
          />
        </Grid>
        <GridItemTextField label="Teaching Subject(s)" name="work.teachingSubjectAreas" />
        <GridItemTextField label="English Teacher Location" name="work.englishTeacherLocation" />
        <GridItemTextField label="Looking for Job" name="work.lookingForJob" />
      </GridContainer>
    </>
  );
};
