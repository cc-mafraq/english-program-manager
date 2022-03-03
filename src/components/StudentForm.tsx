import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { isEmpty } from "lodash";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormAcademicRecordItem,
  FormCorrespondenceItem,
  FormList,
  FormPhoneItem,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemRadioGroup,
  GridItemTextField,
  LabeledCheckbox,
  StudentFormLabel,
} from ".";
import { useFormList } from "../hooks";
import {
  genderedLevels,
  levels,
  levelsPlus,
  nationalities,
  Status,
  statuses,
  Student,
  withdrawReasons,
} from "../interfaces";
import {
  db,
  generateId,
  getAllSessions,
  removeNullFromObject,
  setPrimaryNumberBooleanArray,
  SPACING,
  studentFormSchema,
} from "../services";

interface StudentFormProps {
  handleDialogClose: () => void;
  selectedStudent?: Student;
  students: Student[];
}

export const StudentForm: React.FC<StudentFormProps> = ({
  students,
  selectedStudent,
  handleDialogClose,
}) => {
  const methods = useForm<Student>({
    criteriaMode: "all",
    defaultValues: setPrimaryNumberBooleanArray(selectedStudent),
    resolver: yupResolver(studentFormSchema),
  });
  const [phoneNumbers, addPhone, removePhone] = useFormList(
    selectedStudent
      ? selectedStudent.phone.phoneNumbers
      : [
          {
            number: null,
          },
        ],
    "phone.phoneNumbers",
    methods,
  );
  const [academicRecords, addAcademicRecord, removeAcademicRecord] = useFormList(
    selectedStudent && selectedStudent.academicRecords ? selectedStudent.academicRecords : [],
    "academicRecords",
    methods,
  );
  const [correspondence, addCorrespondence, removeCorrespondence] = useFormList(
    selectedStudent && selectedStudent.correspondence ? selectedStudent?.correspondence : [],
    "correspondence",
    methods,
  );

  const addOrEdit = selectedStudent ? "Edit" : "Add";

  const onSubmit = (data: Student) => {
    const primaryPhone = data.phone.phoneNumbers[data.phone.primaryPhone as number].number;
    if (primaryPhone) {
      data.phone.primaryPhone = primaryPhone;
    }
    if (isEmpty(data.academicRecords) && data.status.currentStatus === Status.NEW) {
      data.academicRecords = [
        {
          level: data.currentLevel,
          session: data.initialSession,
        },
      ];
    }
    const dataNoNull = removeNullFromObject(data) as Student;
    setDoc(doc(collection(db, "students"), dataNoNull.epId.toString()), dataNoNull);
    handleDialogClose();
  };

  return (
    <FormProvider {...methods}>
      <form>
        <Box>
          <Typography fontWeight={600} variant="h4">
            {addOrEdit} Student
          </Typography>
        </Box>
        <GridContainer marginBottom={SPACING}>
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
        </GridContainer>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Program Information</StudentFormLabel>
        <GridContainer>
          <GridItemTextField label="ID" name="epId" value={generateId(students).toString()} />
          <GridItemAutocomplete label="Current Level" options={[...genderedLevels, "L5 GRAD"]} />
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
        </GridContainer>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Student Information</StudentFormLabel>
        <GridContainer marginBottom={0}>
          <GridItemAutocomplete label="Nationality" options={nationalities} />
          <GridItemTextField label="Age" />
          <GridItemTextField label="Occupation" name="work.occupation" />
          <GridItemRadioGroup gridProps={{ xs: 2 }} label="Gender" options={["M", "F"]} />
        </GridContainer>
        <GridContainer>
          <Grid item xs={2}>
            <LabeledCheckbox label="Teacher" name="work.isTeacher" />
            <LabeledCheckbox label="English Teacher" name="work.isEnglishTeacher" />
          </Grid>
          <GridItemTextField label="Teaching Subject(s)" name="work.teachingSubjectAreas" />
          <GridItemTextField label="English Teacher Location" name="work.englishTeacherLocation" />
          <GridItemTextField label="Looking for Job" name="work.lookingForJob" />
        </GridContainer>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Correspondence</StudentFormLabel>
        <GridContainer>
          <FormList
            addItem={addCorrespondence}
            buttonLabel="Add Correspondence"
            list={correspondence}
            removeItem={removeCorrespondence}
          >
            <FormCorrespondenceItem />
          </FormList>
        </GridContainer>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>
          Phone Numbers and WhatsApp
        </StudentFormLabel>
        <GridContainer marginBottom={SPACING}>
          <FormList
            addItem={addPhone}
            buttonGridProps={{ xs: 2 }}
            buttonLabel="Add Phone"
            list={phoneNumbers}
            removeItem={removePhone}
          >
            <FormPhoneItem />
          </FormList>
          <Grid item xs>
            <GridItemTextField
              gridProps={{ paddingBottom: SPACING, paddingLeft: 0 }}
              label="WhatsApp Broadcast SAR"
              name="phone.waBroadcastSAR"
            />
            <GridItemTextField
              label="Other WA Broadcast Groups"
              name="phone.otherWaBroadcastGroups"
            />
          </Grid>
        </GridContainer>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Original Placement</StudentFormLabel>
        <GridContainer>
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
        </GridContainer>
        <Divider />
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
        </GridContainer>
        <Divider />
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
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Status</StudentFormLabel>
        <GridContainer marginBottom={0}>
          <GridItemDatePicker label="Withdraw Date" name="status.withdrawDate" />
          <GridItemAutocomplete
            label="Withdraw Reason"
            name="status.droppedOutReason"
            options={withdrawReasons}
          />
          <GridItemDatePicker label="Reactivated Date" name="status.reactivatedDate" />
        </GridContainer>
        <GridContainer>
          <GridItemDatePicker label="Final Grade Report Sent" name="status.finalGradeSentDate" />
          <GridItemDatePicker label="Level Reeval Date" name="status.levelReevalDate" />
          <Grid item xs>
            <LabeledCheckbox label="Audit" name="status.audit" />
          </Grid>
        </GridContainer>
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
        <GridContainer>
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
        </GridContainer>
        <Divider />
        <GridContainer marginBottom={0}>
          <FormList
            addItem={addAcademicRecord}
            buttonLabel="Add Academic Record"
            list={academicRecords}
            removeItem={removeAcademicRecord}
          >
            <FormAcademicRecordItem students={students} />
          </FormList>
        </GridContainer>
        <Button
          className="update-button"
          color="primary"
          onClick={methods.handleSubmit(onSubmit)}
          sx={{ marginTop: SPACING }}
          type="submit"
          variant="contained"
        >
          Submit
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

StudentForm.defaultProps = {
  selectedStudent: undefined,
};
