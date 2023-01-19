import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { nationalities, Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import {
  FormLabel,
  GridContainer,
  GridItemAutocomplete,
  GridItemRadioGroup,
  GridItemTextField,
  LabeledCheckbox,
} from "../../reusables";

export const FormDemographics: React.FC = () => {
  const { watch } = useFormContext<Student>();
  const teacherChecked = watch("work.isTeacher");

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Demographics</FormLabel>
      <GridContainer marginBottom={0}>
        <GridItemRadioGroup gridProps={{ sm: 2, xs: 4 }} label="Gender *" options={["M", "F"]} />
        <GridItemAutocomplete
          gridProps={{ sm: true, xs: 8 }}
          label="Nationality"
          options={nationalities}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField gridProps={{ sm: true, xs: 4 }} label="Age" textFieldProps={{ required: true }} />
        <GridItemTextField label="Occupation" name="work.occupation" textFieldProps={{ required: true }} />
      </GridContainer>
      <GridContainer>
        <Grid item sm={2} xs={4}>
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
          gridProps={{ sm: teacherChecked ? true : 6 }}
          label="Looking for Job"
          name="work.lookingForJob"
        />
      </GridContainer>
    </>
  );
};
