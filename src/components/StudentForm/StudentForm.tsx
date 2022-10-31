import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
import {
  FormAcademicRecords,
  FormCertRequests,
  FormCorrespondence,
  FormCovidVaccine,
  FormDemographics,
  FormLabel,
  FormLiteracyAndZoom,
  FormName,
  FormOriginalPlacement,
  FormPhoneNumbers,
  FormPlacement,
  FormProgramInformation,
  FormStatus,
} from "..";
import { AppContext } from "../../interfaces";
import { SPACING } from "../../services";

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
      <FormDemographics />
      <Divider />
      <FormPhoneNumbers phonePath="phone.phoneNumbers" selectedStudentPath="selectedStudent" />
      <Divider />
      <FormCovidVaccine />
      <Divider />
      <FormOriginalPlacement />
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
      <FormLabel textProps={{ marginTop: SPACING }}>Academic Records</FormLabel>
      <FormAcademicRecords />
    </>
  );
};
