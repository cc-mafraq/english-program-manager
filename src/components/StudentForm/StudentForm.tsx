import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
import {
  FormAcademicRecords,
  FormCertRequests,
  FormCorrespondence,
  FormCovidVaccine,
  FormDemographics,
  FormLiteracyAndZoom,
  FormName,
  FormOriginalPlacement,
  FormPhoneNumbers,
  FormPlacement,
  FormProgramInformation,
  FormStatus,
} from "..";
import { AppContext } from "../../interfaces";

export const StudentForm: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  const addOrEdit = selectedStudent ? "Edit" : "Add";

  return (
    <>
      <Box>
        <Typography display="inline" fontWeight={600} variant="h4">
          {addOrEdit} Student
        </Typography>
      </Box>
      <FormName />
      <Divider />
      <FormProgramInformation />
      <Divider />
      <FormPhoneNumbers phonePath="phone.phoneNumbers" selectedStudentPath="selectedStudent" />
      <Divider />
      <FormDemographics />
      <Divider />
      <FormOriginalPlacement />
      <Divider />
      <FormCovidVaccine />
      <Divider />
      <FormLiteracyAndZoom />
      <Divider />
      <FormCorrespondence selectedStudentPath="selectedStudent" />
      <Divider />
      <FormPlacement />
      <Divider />
      <FormStatus />
      <Divider />
      <FormCertRequests />
      <Divider />
      <FormAcademicRecords />
    </>
  );
};
