import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@mui/material";
import { map } from "lodash";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GridItemAutocomplete, GridItemRadioGroup, GridItemTextField, LabeledCheckbox } from ".";
import {
  AcademicRecord,
  genderedLevels,
  levels,
  nationalities,
  PhoneNumber,
  results,
  statuses,
  Student,
} from "../interfaces";
import { generateId, getAllSessions, studentFormSchema } from "../services";

interface StudentFormProps {
  students: Student[];
}

const defaultPhone: PhoneNumber = {
  number: -1,
};

const defaultAcademicRecord: AcademicRecord = {
  session: "",
};

const SPACING = 2;
const MARGIN = 0;

export const StudentForm: React.FC<StudentFormProps> = ({ students }) => {
  const methods = useForm<Student>({
    criteriaMode: "all",
    // defaultValues: mapInternalTypesToInput(values),
    resolver: yupResolver(studentFormSchema),
  });
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([defaultPhone]);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([defaultAcademicRecord]);

  const addPhone = async () => {
    setPhoneNumbers([...phoneNumbers, defaultPhone]);
  };

  const addAcademicRecord = async () => {
    setAcademicRecords([...academicRecords, defaultAcademicRecord]);
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
          <Grid item>
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
          {map(phoneNumbers, (phoneNumber, i) => {
            const phoneName = `phone.phoneNumbers[${i}]`;
            return (
              <Grid key={phoneName} item padding={SPACING} xs>
                <GridItemTextField label={`Phone Number ${i + 1}`} name={`${phoneName}.phone`} />
                <GridItemTextField
                  gridProps={{ marginTop: SPACING / 2 }}
                  label={`Phone Notes ${i + 1}`}
                  name={`${phoneName}.notes`}
                />
                <LabeledCheckbox
                  containerProps={{ marginTop: 0 }}
                  label="Primary?"
                  name={`phone.primaryPhone[${i}]`}
                />
              </Grid>
            );
          })}
          <Grid item xs>
            <Button color="secondary" onClick={addPhone} variant="contained">
              Add Phone
            </Button>
            <GridItemTextField
              gridProps={{ padding: SPACING, paddingLeft: 0 }}
              label="WhatsApp Broadcast SAR"
              name="phone.waBroadcastSAR"
            />
            <LabeledCheckbox label="Has WhatsApp?" name="phone.hasWhatsapp" />
          </Grid>
          <Grid item xs>
            <GridItemTextField
              gridProps={{ paddingRight: SPACING }}
              label="Other WA Broadcast Groups"
              name="phone.otherWaBroadcastGroups"
            />
            <GridItemTextField
              gridProps={{ paddingRight: SPACING, paddingTop: SPACING }}
              label="WhatsApp Notes"
              name="phone.whatsappNotes"
            />
          </Grid>
          <Grid item xs>
            <LabeledCheckbox label="Illiterate - AR" name="literacy.illiterateAr" />
            <LabeledCheckbox label="Illiterate - ENG" name="literacy.illiterateAr" />
            <GridItemTextField
              gridProps={{ paddingRight: SPACING, paddingTop: SPACING / 2 }}
              label="Tutor and Date"
              name="literacy.tutorAndDate"
            />
          </Grid>
        </Grid>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          {map(academicRecords, (academicRecord, i) => {
            const recordName = `academicRecords[${i}]`;
            return (
              <Grid container>
                <Typography fontWeight={600} marginLeft={SPACING} variant="h6">
                  Academic Record {i + 1}
                </Typography>
                <Grid key={recordName} container>
                  <Grid item xs>
                    <GridItemTextField
                      gridProps={{ padding: SPACING }}
                      label="Session"
                      name={`${recordName}.session`}
                    />
                    <GridItemAutocomplete
                      gridProps={{ padding: SPACING, paddingTop: 0 }}
                      label="Level"
                      name={`${recordName}.level`}
                      options={genderedLevels}
                    />
                    <GridItemTextField
                      gridProps={{ padding: SPACING, paddingTop: 0 }}
                      label="Attendance Percentage"
                      name={`${recordName}.attendance`}
                    />
                  </Grid>
                  <Grid item xs>
                    <GridItemRadioGroup
                      label="Result"
                      name={`${recordName}.finalResult.result`}
                      options={results}
                    />
                    <GridItemTextField
                      gridProps={{ padding: SPACING, paddingLeft: 0 }}
                      label="Final Grades"
                      name={`${recordName}.finalResult.percentage`}
                    />
                    <GridItemTextField
                      gridProps={{ paddingRight: SPACING }}
                      label="Final Grades Notes"
                      name={`${recordName}.finalResult.notes`}
                    />
                  </Grid>
                  <Grid item xs>
                    <GridItemRadioGroup
                      label="Writing Exit Exam Result"
                      name={`${recordName}.exitWritingExam.result`}
                      options={results}
                    />
                    <GridItemTextField
                      gridProps={{ padding: SPACING, paddingLeft: 0 }}
                      label="Writing Exit Exam Percentage"
                      name={`${recordName}.exitWritingExam.percentage`}
                    />
                    <GridItemTextField
                      gridProps={{ paddingRight: SPACING }}
                      label="Writing Exit Exam Notes"
                      name={`${recordName}.exitWritingExam.notes`}
                    />
                  </Grid>
                  <Grid item xs>
                    <GridItemRadioGroup
                      label="Speaking Exit Exam Result"
                      name={`${recordName}.exitSpeakingExam.result`}
                      options={results}
                    />
                    <GridItemTextField
                      gridProps={{ padding: SPACING, paddingLeft: 0 }}
                      label="Speaking Exit Exam Percentage"
                      name={`${recordName}.exitSpeakingExam.percentage`}
                    />
                    <GridItemTextField
                      gridProps={{ paddingRight: SPACING }}
                      label="Speaking Exit Exam Notes"
                      name={`${recordName}.exitSpeakingExam.notes`}
                    />
                  </Grid>
                  <Grid item xs>
                    <GridItemAutocomplete
                      gridProps={{ padding: SPACING }}
                      label="Level Audited"
                      name={`${recordName}.levelAudited`}
                      options={genderedLevels}
                    />
                    <GridItemTextField
                      gridProps={{ padding: SPACING, paddingTop: 0 }}
                      label="Elective Class Attended"
                      name={`${recordName}.electiveClass`}
                    />
                    <LabeledCheckbox
                      containerProps={{ paddingLeft: SPACING }}
                      label="Certificate"
                      name={`${recordName}.certificate`}
                    />
                  </Grid>
                  <Grid item xs>
                    <GridItemTextField
                      gridProps={{ padding: SPACING, paddingLeft: 0 }}
                      label="Teacher Comments"
                      name={`${recordName}.comments`}
                      textFieldProps={{ multiline: true, rows: 7 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={3}>
            <Button color="secondary" onClick={addAcademicRecord} variant="contained">
              Add Academic Record
            </Button>
          </Grid>
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
