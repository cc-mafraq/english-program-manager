import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { FormCorrespondence, FormEntryInformation, FormOutcome, FormPhoneNumbers, FormPlacementExam } from "..";
import { useAppStore, useWaitingListStore } from "../../hooks";
import { SPACING } from "../../services";

export const WaitingListForm: React.FC = () => {
  const selectedWaitingListEntry = useWaitingListStore((state) => {
    return state.selectedWaitingListEntry;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const disabled = role !== "admin";
  const addOrEdit = selectedWaitingListEntry ? "Edit" : "Add";

  return (
    <>
      <Box marginBottom={SPACING}>
        <Typography display="inline" fontWeight={600} variant="h4">
          {addOrEdit} Waiting List Entry
        </Typography>
      </Box>
      <Divider />
      <FormPhoneNumbers noWhatsapp phonePath="phoneNumbers" selectedData={selectedWaitingListEntry} />
      <Divider />
      <FormEntryInformation disabled={disabled} />
      <Divider />
      <FormOutcome disabled={disabled} />
      <Divider />
      <FormPlacementExam disabled={disabled} />
      <Divider />
      <FormCorrespondence disabled={disabled} selectedData={selectedWaitingListEntry} />
    </>
  );
};
