import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useStore } from "zustand";
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
import { AppContext } from "../../App";

export const StudentForm: React.FC = () => {
  const store = useContext(AppContext);
  const selectedStudent = useStore(store, (state) => {
    return state.selectedStudent;
  });

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
