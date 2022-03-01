import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { cloneDeep, isEmpty, isUndefined } from "lodash";
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
import { FormAcademicRecordItem } from "./FormAcademicRecordItem";
import { FormCorrespondenceItem } from "./FormCorrespondenceItem";
import { FormList } from "./FormList";
import { FormPhoneItem } from "./FormPhoneItem";

interface StudentFormProps {
  handleDialogClose: () => void;
  selectedStudent?: Student;
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

const MARGIN = 0;

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
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(
    selectedStudent ? selectedStudent.phone.phoneNumbers : [defaultPhone],
  );
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>(
    selectedStudent && selectedStudent.academicRecords ? selectedStudent.academicRecords : [],
  );
  const [correspondence, setCorrespondence] = useState<Correspondence[]>(
    selectedStudent && selectedStudent.correspondence ? selectedStudent?.correspondence : [],
  );

  const addOrEdit = selectedStudent ? "Edit" : "Add";

  const addPhone = async () => {
    setPhoneNumbers([...phoneNumbers, defaultPhone]);
  };

  const addAcademicRecord = async () => {
    setAcademicRecords([...academicRecords, defaultAcademicRecord]);
  };

  const addCorrespondence = async () => {
    setCorrespondence([...correspondence, defaultCorrespondence]);
  };

  const removeAcademicRecord = (index?: number) => {
    return () => {
      if (isUndefined(index)) return;
      const newAcademicRecords = cloneDeep(academicRecords);
      newAcademicRecords.splice(index, 1);
      setAcademicRecords(newAcademicRecords);
      methods.reset({
        academicRecords: [],
      });
      methods.setValue("academicRecords", newAcademicRecords);
    };
  };

  const removePhone = (index?: number) => {
    return () => {
      if (isUndefined(index)) return;
      const newPhoneNumbers = cloneDeep(phoneNumbers);
      newPhoneNumbers.splice(index, 1);
      setPhoneNumbers(newPhoneNumbers);
      methods.reset({
        phone: {
          phoneNumbers: [],
        },
      });
      methods.setValue("phone.phoneNumbers", newPhoneNumbers);
    };
  };

  const removeCorrespondence = (index?: number) => {
    return () => {
      if (isUndefined(index)) return;
      const newCorrespondence = cloneDeep(correspondence);
      newCorrespondence.splice(index, 1);
      setCorrespondence(newCorrespondence);
      methods.reset({ correspondence: [] });
      methods.setValue("correspondence", newCorrespondence);
    };
  };

  const onSubmit = (data: Student) => {
    data.phone.primaryPhone = data.phone.phoneNumbers[data.phone.primaryPhone as number].number;
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
          <FormList
            addItem={addCorrespondence}
            buttonLabel="Add Correspondence"
            list={correspondence}
            removeItem={removeCorrespondence}
          >
            <FormCorrespondenceItem />
          </FormList>
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>
          Phone Numbers and WhatsApp
        </StudentFormLabel>
        <Grid container marginBottom={SPACING} marginTop={MARGIN} spacing={SPACING}>
          <FormList
            addItem={addPhone}
            buttonLabel="Add Phone"
            list={phoneNumbers}
            removeItem={removePhone}
          >
            <FormPhoneItem />
          </FormList>
          <Grid item xs>
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
            <LabeledCheckbox label="Pending" name="placement.pending" />
          </Grid>
          <GridItemTextField label="Sections Offered" name="placement.sectionsOffered" />
          <GridItemTextField label="Placement" name="placement.placement" />
        </Grid>
        <Grid container marginBottom={SPACING * 2} marginTop={MARGIN} spacing={SPACING}>
          <GridItemDatePicker label="Confirmed Date" name="placement.confDate" />
          <GridItemDatePicker label="Photo Contact" name="placement.photoContact" />
          <GridItemDatePicker
            label="No Answer Class Schedule"
            name="placement.noAnswerClassScheduleDate"
          />
        </Grid>
        <Divider />
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Status</StudentFormLabel>
        <Grid container marginTop={MARGIN} spacing={SPACING}>
          <GridItemDatePicker label="Withdraw Date" name="status.withdrawDate" />
          <GridItemAutocomplete
            label="Withdraw Reason"
            name="status.droppedOutReason"
            options={withdrawReasons}
          />
          <GridItemDatePicker label="Reactivated Date" name="status.reactivatedDate" />
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
          <FormList
            addItem={addAcademicRecord}
            buttonLabel="Add Academic Record"
            list={academicRecords}
            removeItem={removeAcademicRecord}
          >
            <FormAcademicRecordItem students={students} />
          </FormList>
        </Grid>
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
