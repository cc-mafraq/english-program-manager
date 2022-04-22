import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
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
  StudentFormLabel,
} from "..";
import { AppContext } from "../../interfaces";
import { SPACING } from "../../services";
import { FormCovidVaccine } from "./FormSections";

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
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Academic Records</StudentFormLabel>
      <FormAcademicRecords />
    </>
  );
};
