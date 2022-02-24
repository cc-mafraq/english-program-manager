import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { isEmpty, map } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemRadioGroup,
  GridItemTextField,
  LabeledCheckbox,
  StudentFormLabel,
} from ".";
import {
  AcademicRecord,
  Correspondence,
  genderedLevels,
  levels,
  levelsPlus,
  nationalities,
  PhoneNumber,
  results,
  Status,
  statuses,
  Student,
  withdrawReasons,
} from "../interfaces";
import { generateId, getAllSessions, removeNullFromObject, studentFormSchema } from "../services";

interface StudentFormProps {
  handleDialogClose: () => void;
  students: Student[];
}

const defaultPhone: PhoneNumber = {
  number: -1,
};

const defaultAcademicRecord: AcademicRecord = {
  session: "",
};

const defaultCorrespondence: Correspondence = {
  date: "",
  notes: "",
};

const SPACING = 2;
const MARGIN = 0;

export const StudentForm: React.FC<StudentFormProps> = ({ students, handleDialogClose }) => {
  const methods = useForm<Student>({
    criteriaMode: "all",
    // defaultValues: student,
    resolver: yupResolver(studentFormSchema),
  });
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([defaultPhone]);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [correspondence, setCorrespondence] = useState<Correspondence[]>([]);

  const addPhone = async () => {
    setPhoneNumbers([...phoneNumbers, defaultPhone]);
  };

  const addAcademicRecord = async () => {
    setAcademicRecords([...academicRecords, defaultAcademicRecord]);
  };

  const addCorrespondence = async () => {
    setCorrespondence([...correspondence, defaultCorrespondence]);
  };

  const onSubmit = (data: Student) => {
    data.phone.primaryPhone = data.phone.phoneNumbers[data.phone.primaryPhone].number;
    if (isEmpty(data.academicRecords) && data.status.currentStatus === Status.NEW) {
      data.academicRecords = [
        {
          level: data.currentLevel,
          session: data.initialSession,
        },
      ];
    }
    const dataNoNull = removeNullFromObject(data) as Student;
    console.log(dataNoNull);
    handleDialogClose();
  };

  return (
    <FormProvider {...methods}>
      <form>
        <Box>
          <Typography fontWeight={600} variant="h4">
            Add Student
          </Typography>
        </Box>
        <Grid container marginBottom={SPACING} marginTop={MARGIN} spacing={SPACING}>
          <GridItemTextField label="Name - ENG" name="name.english" />
          <GridItemTextField label="Name - AR" name="name.arabic" />
          <Grid item>
            <LabeledCheckbox
              checkboxProps={{ defaultChecked: true }}
              label="Invite"
              name="status.inviteTag"
            />
            <LabeledCheckbox label="NCL" name="status.noContactList" />
          </Grid>
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Program Information</StudentFormLabel>
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
          <GridItemTextField label="ID" name="epId" value={generateId(students).toString()} />
          <GridItemAutocomplete label="Current Level" options={genderedLevels} />
          <GridItemAutocomplete
            defaultValue="NEW"
            label="Current Status"
            name="status.currentStatus"
            options={statuses}
          />
          <GridItemAutocomplete
            freeSolo
            label="Initial Session"
            options={getAllSessions(students)}
          />
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Student Information</StudentFormLabel>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <GridItemAutocomplete label="Nationality" options={nationalities} />
          <GridItemTextField label="Age" />
          <GridItemTextField label="Occupation" name="work.occupation" />
          <GridItemRadioGroup gridProps={{ xs: 2 }} label="Gender" options={["M", "F"]} />
        </Grid>
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
          <Grid item xs={2}>
            <LabeledCheckbox label="Teacher" name="work.isTeacher" />
            <LabeledCheckbox label="English Teacher" name="work.isEnglishTeacher" />
          </Grid>
          <GridItemTextField label="Teaching Subject(s)" name="work.teachingSubjectAreas" />
          <GridItemTextField
            label="If ELT: public, private, university, refugee"
            name="work.englishTeacherLocation"
          />
          <GridItemTextField label="Looking for Job" name="work.lookingForJob" />
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Correspondence</StudentFormLabel>
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
          {map(correspondence, (c, i) => {
            const correspondenceName = `correspondence[${i}]`;
            return (
              <Grid key={correspondenceName} container>
                <GridItemDatePicker
                  gridProps={{ margin: SPACING, xs: 2 }}
                  label="Date"
                  name={`${correspondenceName}.date`}
                  value={moment()}
                />
                <GridItemTextField
                  gridProps={{ marginTop: SPACING }}
                  label="Correspondence"
                  name={`${correspondenceName}.notes`}
                  textFieldProps={{ multiline: true, rows: 4 }}
                />
              </Grid>
            );
          })}
          <Grid item xs={3}>
            <Button color="secondary" onClick={addCorrespondence} variant="contained">
              Add Correspondence
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>
          Phone Numbers and WhatsApp
        </StudentFormLabel>
        <Grid container marginBottom={SPACING} marginTop={MARGIN} spacing={SPACING}>
          {map(phoneNumbers, (phoneNumber, i) => {
            const phoneName = `phone.phoneNumbers[${i}]`;
            return (
              <Grid key={phoneName} item padding={SPACING} xs>
                <GridItemTextField label={`Phone Number ${i + 1}`} name={`${phoneName}.number`} />
                <GridItemTextField
                  gridProps={{ marginTop: SPACING / 2 }}
                  label={`Phone Notes ${i + 1}`}
                  name={`${phoneName}.notes`}
                />
                <LabeledCheckbox
                  containerProps={{ marginTop: 0 }}
                  errorName="phone.primaryPhone"
                  label="Primary"
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
            <LabeledCheckbox label="Has WhatsApp" name="phone.hasWhatsapp" />
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
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Original Placement</StudentFormLabel>
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
          <GridItemAutocomplete
            label="Writing Placement"
            name="placement.origPlacementData.writing"
            options={levelsPlus}
          />
          <GridItemAutocomplete
            label="Speaking Placement"
            name="placement.origPlacementData.speaking"
            options={levelsPlus}
          />
          <GridItemAutocomplete
            label="Placement Level"
            name="placement.origPlacementData.level"
            options={levels}
          />
          <GridItemTextField
            label="Placement Adjustment"
            name="placement.origPlacementData.adjustment"
          />
        </Grid>
        <Divider />
        <Grid container>
          <Grid item xs>
            <StudentFormLabel textProps={{ marginTop: SPACING }}>Literacy</StudentFormLabel>
          </Grid>
          <Grid item xs>
            <StudentFormLabel textProps={{ marginTop: SPACING }}>Zoom</StudentFormLabel>
          </Grid>
        </Grid>
        <Grid container marginBottom={SPACING * 2} marginTop={SPACING / 2}>
          <Grid item xs>
            <LabeledCheckbox label="Illiterate - AR" name="literacy.illiterateAr" />
            <LabeledCheckbox label="Illiterate - ENG" name="literacy.illiterateEng" />
            <GridItemTextField
              gridProps={{ paddingRight: SPACING, paddingTop: SPACING / 2 }}
              label="Tutor and Date"
              name="literacy.tutorAndDate"
            />
          </Grid>
          <Grid item xs>
            <GridItemTextField
              label="Tutor / Club and Details"
              name="zoom"
              textFieldProps={{ multiline: true, rows: 4 }}
            />
          </Grid>
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Placement</StudentFormLabel>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <Grid item xs={2}>
            <LabeledCheckbox label="Notified" name="placement.notified" />
            <LabeledCheckbox label="Pending" name="placement.pending" />
          </Grid>
          <GridItemTextField label="Sections Offered" name="placement.sectionsOffered" />
          <GridItemTextField label="Placement" name="placement.placement" />
        </Grid>
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
          <GridItemDatePicker
            errorName="placement.confDate[0]"
            label="Confirmed Date"
            name="placement.confDate"
          />
          <GridItemDatePicker
            errorName="placement.photoContact[0]"
            label="Photo Contact"
            name="placement.photoContact"
          />
          <GridItemDatePicker
            label="No Answer Class Schedule"
            name="placement.noAnswerClassScheduleDate"
          />
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Status</StudentFormLabel>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <GridItemDatePicker
            errorName="status.withdrawDate[0]"
            label="Withdraw Date"
            name="status.withdrawDate"
          />
          <GridItemAutocomplete
            label="Withdraw Reason"
            name="status.droppedOutReason"
            options={withdrawReasons}
          />
          <GridItemDatePicker
            errorName="status.reactivatedDate[0]"
            label="Reactivated Date"
            name="status.reactivatedDate"
          />
        </Grid>
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
          <GridItemDatePicker label="Final Grade Report Sent" name="status.finalGradeSentDate" />
          <GridItemDatePicker label="Level Reeval Date" name="status.levelReevalDate" />
          <Grid item xs>
            <LabeledCheckbox label="Audit" name="status.audit" />
          </Grid>
        </Grid>
        <Divider />
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
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
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
        </Grid>
        <Divider />
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          {map(academicRecords, (academicRecord, i) => {
            const recordName = `academicRecords[${i}]`;
            return (
              <Grid key={recordName} container>
                <StudentFormLabel textProps={{ marginLeft: SPACING, marginTop: SPACING }}>
                  Academic Record {i + 1}
                </StudentFormLabel>
                <Grid key={recordName} container>
                  <Grid item xs>
                    <GridItemAutocomplete
                      freeSolo
                      gridProps={{ padding: SPACING }}
                      label="Session"
                      name={`${recordName}.session`}
                      options={getAllSessions(students)}
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
        <Grid item>
          <Typography variant="caption">
            Tip: use <b>tab</b> and <b>shift + tab</b> to navigate, <b>space bar</b> to select
            checkboxes, <b>arrow keys</b> to select radio buttons, and <b>return</b> to submit and
            click buttons.
          </Typography>
        </Grid>
      </form>
    </FormProvider>
  );
};
