import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Grid, Typography, useTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { isEmpty } from "lodash";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormAcademicRecords,
  FormCertRequests,
  FormCorrespondence,
  FormDemographics,
  FormLiteracyAndZoom,
  FormName,
  FormOriginalPlacement,
  FormPhoneNumbers,
  FormPlacement,
  FormProgramInformation,
  FormStatus,
} from "..";
import { AppContext, Status, Student } from "../../interfaces";
import {
  deleteStudentData,
  removeNullFromObject,
  setPrimaryNumberBooleanArray,
  setStudentData,
  SPACING,
  studentFormSchema,
} from "../../services";
import { FormCovidVaccine } from "./FormSections";

interface StudentFormProps {
  handleDialogClose: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ handleDialogClose }) => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  const methods = useForm<Student>({
    criteriaMode: "all",
    defaultValues: setPrimaryNumberBooleanArray(selectedStudent),
    resolver: yupResolver(studentFormSchema),
  });
  const theme = useTheme();

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
    setStudentData(dataNoNull);
    dataNoNull.epId !== selectedStudent?.epId && selectedStudent && deleteStudentData(selectedStudent);
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
        <FormProgramInformation />
        <Divider />
        <FormDemographics />
        <Divider />
        <FormCorrespondence />
        <Divider />
        <FormCovidVaccine />
        <Divider />
        <FormPhoneNumbers />
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
        <FormAcademicRecords />
        <Button
          className="update-button"
          onClick={methods.handleSubmit(onSubmit)}
          sx={{
            "&:hover": {
              backgroundColor: green[900],
            },
            backgroundColor: green[800],
            color: theme.palette.mode === "light" ? "white" : grey[200],
            marginTop: SPACING,
          }}
          type="submit"
          variant="contained"
        >
          Submit
        </Button>
        <Grid item>
          <Typography variant="caption">
            Tip: use <b>tab</b> and <b>shift + tab</b> to navigate, <b>space bar</b> to select checkboxes,{" "}
            <b>arrow keys</b> to select radio buttons, and <b>return</b> to submit and click buttons.
          </Typography>
        </Grid>
      </form>
    </FormProvider>
  );
};
