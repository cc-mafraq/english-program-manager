import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
import { FormCorrespondence, FormEntryInformation, FormPhoneNumbers, FormPlacementExam } from "..";
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
      <FormEntryInformation />
      <Divider />
      <FormPhoneNumbers noWhatsapp phonePath="phoneNumbers" selectedStudentPath="selectedWaitingListEntry" />
      <Divider />
      <FormCorrespondence selectedStudentPath="selectedWaitingListEntry" />
      <Divider />
      <FormPlacementExam />
    </>
  );
};
