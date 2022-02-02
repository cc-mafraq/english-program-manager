import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@mui/material";
import { map } from "lodash";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GridItemAutocomplete, GridItemRadioGroup, GridItemTextField, LabeledCheckbox } from ".";
import {
  genderedLevels,
  levels,
  nationalities,
  PhoneNumber,
  statuses,
  Student,
} from "../interfaces";
import { generateId, getAllSessions, studentFormSchema } from "../services";

interface StudentFormProps {
  students: Student[];
}

const defaultPhone = {
  phone: "",
};

const SPACING = 2;
const MARGIN = 0;

export const StudentForm: React.FC<StudentFormProps> = ({ students }) => {
  const methods = useForm<Student>({
    criteriaMode: "all",
    // defaultValues: mapInternalTypesToInput(values),
    resolver: yupResolver(studentFormSchema),
  });
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);

  const addPhone = async () => {
    setPhoneNumbers([...phoneNumbers, defaultPhone]);
  };

  const onSubmit = (data: Student) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form>
        <Box>
          <Typography fontWeight={600} variant="h4">
            Add Student
          </Typography>
        </Box>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <GridItemTextField label="Name - ENG" name="name.english" />
          <GridItemTextField label="Name - AR" name="name.arabic" />
          <Grid item textAlign="center">
            <LabeledCheckbox
              checkboxProps={{ defaultChecked: true }}
              label="Invite?"
              name="status.inviteTag"
            />
            <LabeledCheckbox label="NCL" name="status.noCallList" />
          </Grid>
        </Grid>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <GridItemTextField label="ID" name="epId" value={generateId(students).toString()} />
          <GridItemAutocomplete label="Nationality" options={nationalities} />
          <GridItemAutocomplete label="Current Level" options={genderedLevels} />
          <GridItemAutocomplete
            label="Current Status"
            name="status.currentStatus"
            options={statuses}
            value="NEW"
          />
          <GridItemTextField label="Age" />
        </Grid>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <GridItemRadioGroup label="Gender" options={["M", "F"]} />
          <GridItemTextField label="Occupation" name="work.occupation" />
          <Grid item xs>
            <LabeledCheckbox label="Teacher?" name="work.isTeacher" />
            <LabeledCheckbox label="English Teacher?" name="work.isEnglishTeacher" />
          </Grid>
          <GridItemTextField label="Teaching Subject(s)" name="work.teachingSubjectAreas" />
          <GridItemTextField
            label="If ELT: public, private, university, refugee"
            name="work.englishTeacherLocation"
          />
        </Grid>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <GridItemAutocomplete
            freeSolo
            label="Initial Session"
            options={getAllSessions(students)}
          />
          <GridItemAutocomplete
            label="Writing Orig Placement"
            name="placement.origPlacementData.writing"
            options={levels}
          />
          <GridItemAutocomplete
            label="Speaking Orig Placement"
            name="placement.origPlacementData.speaking"
            options={levels}
          />
          <GridItemAutocomplete
            label="Orig Placement Level"
            name="placement.origPlacementData.level"
            options={levels}
          />
          <GridItemTextField
            label="Orig Placement Adjustment"
            name="placement.origPlacementData.adjustment"
          />
        </Grid>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <Grid item xs>
            <Button color="secondary" onClick={addPhone} variant="contained">
              Add Phone
            </Button>
          </Grid>
          {map(phoneNumbers, (phoneNumber, i) => {
            const phoneName = `phone.phoneNumbers[${i}]`;
            return (
              <Box key={phoneName} padding={SPACING}>
                <GridItemTextField label={`Phone Number ${i + 1}`} name={`${phoneName}.phone`} />
                <Box marginTop={SPACING}>
                  <GridItemTextField label={`Phone Notes ${i + 1}`} name={`${phoneName}.notes`} />
                </Box>
                <LabeledCheckbox label="Primary?" />
              </Box>
            );
          })}
        </Grid>
        <Button
          className="update-button"
          color="primary"
          onClick={methods.handleSubmit(onSubmit)}
          sx={{ marginTop: SPACING }}
          type="submit"
          variant="contained"
        >
          Add Student
        </Button>
      </form>
    </FormProvider>
  );
};
