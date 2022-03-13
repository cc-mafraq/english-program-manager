import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { isEmpty } from "lodash";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormAcademicRecords,
  FormCertRequests,
  FormCorrespondence,
  FormLiteracyAndZoom,
  FormName,
  FormOriginalPlacement,
  FormPhoneNumbers,
  FormPlacement,
  FormProgramInformation,
  FormStatus,
  FormDemographics,
} from "..";
import { Status, Student } from "../../interfaces";
import {
  db,
  removeNullFromObject,
  setPrimaryNumberBooleanArray,
  SPACING,
  studentFormSchema,
} from "../../services";

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
        <FormName />
        <Divider />
        <FormProgramInformation students={students} />
        <Divider />
        <FormDemographics />
        <Divider />
        <FormCorrespondence selectedStudent={selectedStudent} />
        <Divider />
        <FormPhoneNumbers selectedStudent={selectedStudent} />
        <Divider />
        <FormOriginalPlacement />
        <Divider />
        <FormLiteracyAndZoom />
        <Divider />
        <FormPlacement />
        <Divider />
        <FormStatus />
        <Divider />
        <FormCertRequests />
        <Divider />
        <FormAcademicRecords selectedStudent={selectedStudent} students={students} />
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
