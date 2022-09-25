import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { nationalities, Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import {
  GridContainer,
  GridItemAutocomplete,
  GridItemRadioGroup,
  GridItemTextField,
  LabeledCheckbox,
} from "../../reusables";
import { StudentFormLabel } from "../StudentFormLabel";

export const FormDemographics: React.FC = () => {
  const { watch } = useFormContext<Student>();
  const teacherChecked = watch("work.isTeacher");

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Demographics</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemRadioGroup gridProps={{ xs: 2 }} label="Gender *" options={["M", "F"]} />
        <GridItemAutocomplete label="Nationality" options={nationalities} textFieldProps={{ required: true }} />
        <GridItemTextField label="Age" textFieldProps={{ required: true }} />
        <GridItemTextField label="Occupation" name="work.occupation" textFieldProps={{ required: true }} />
      </GridContainer>
      <GridContainer>
        <Grid item xs={2}>
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="Teacher" name="work.isTeacher" />
          {teacherChecked && (
            <LabeledCheckbox
              containerProps={{ marginTop: -1 }}
              label="English Teacher"
              name="work.isEnglishTeacher"
            />
          )}
        </Grid>
        {teacherChecked && <GridItemTextField label="Teaching Subject(s)" name="work.teachingSubjectAreas" />}
        {watch("work.isEnglishTeacher") && (
          <GridItemTextField label="English Teacher Location" name="work.englishTeacherLocation" />
        )}
        <GridItemTextField
          gridProps={{ xs: teacherChecked ? true : 6 }}
          label="Looking for Job"
          name="work.lookingForJob"
        />
      </GridContainer>
    </>
  );
};
