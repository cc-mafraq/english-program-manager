import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import {
  FormCorrespondence,
  FormEntryInformation,
  FormOutcome,
  FormPhoneNumbers,
  FormPlacementExam,
  FormWaitingListVaccine,
  GridContainer,
} from "..";
import { AppContext } from "../../interfaces";
import { SPACING } from "../../services";

export const WaitingListForm: React.FC = () => {
  const {
    appState: { selectedWaitingListEntry },
  } = useContext(AppContext);

  const addOrEdit = selectedWaitingListEntry ? "Edit" : "Add";

  return (
    <>
      <Box marginBottom={SPACING}>
        <Typography display="inline" fontWeight={600} variant="h4">
          {addOrEdit} Waiting List Entry
        </Typography>
      </Box>
      <Divider />
      <FormPhoneNumbers noWhatsapp phonePath="phoneNumbers" selectedStudentPath="selectedWaitingListEntry" />
      <Divider />
      <FormEntryInformation />
      <Divider />
      <GridContainer>
        <Grid item xs={5}>
          <FormWaitingListVaccine />
        </Grid>
        <Grid item marginLeft={SPACING * 2} xs={6.5}>
          <FormOutcome />
        </Grid>
      </GridContainer>
      <Divider />
      <FormPlacementExam />
      <Divider />
      <FormCorrespondence selectedStudentPath="selectedWaitingListEntry" />
    </>
  );
};
