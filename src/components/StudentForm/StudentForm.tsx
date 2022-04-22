import { Close } from "@mui/icons-material";
import { Box, Divider, Grid, IconButton, Typography } from "@mui/material";
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
} from "..";
import { AppContext } from "../../interfaces";
import { FormCovidVaccine } from "./FormSections";

interface StudentFormProps {
  handleDialogClose: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ handleDialogClose }) => {
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
        <IconButton
          onClick={handleDialogClose}
          sx={{
            float: "right",
            transform: `scale(1.25)`,
          }}
        >
          <Close sx={{ color: "default" }} />
        </IconButton>
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

      <Grid item>
        <Typography variant="caption">
          Tip: use <b>tab</b> and <b>shift + tab</b> to navigate, <b>space bar</b> to select checkboxes,{" "}
          <b>arrow keys</b> to select radio buttons, and <b>return</b> to submit and click buttons.
        </Typography>
      </Grid>
    </>
  );
};
