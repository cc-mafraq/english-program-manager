import { Box, Divider, Typography } from "@mui/material";
import React from "react";
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
  FormProgramInformation,
  FormStatus,
} from "..";
import { useStudentStore } from "../../hooks";

export const StudentForm: React.FC = () => {
  const selectedStudent = useStudentStore((state) => {
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
      <FormPhoneNumbers phonePath="phone.phoneNumbers" selectedData={selectedStudent} />
      <Divider />
      <FormDemographics />
      <Divider />
      <FormOriginalPlacement />
      <Divider />
      <FormCovidVaccine />
      <Divider />
      <FormLiteracyAndZoom />
      <Divider />
      <FormCorrespondence selectedData={selectedStudent} />
      <Divider />
      <FormStatus />
      <Divider />
      <FormCertRequests />
      <Divider />
      <FormAcademicRecords />
    </>
  );
};
