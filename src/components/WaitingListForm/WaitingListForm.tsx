import { Box, Divider, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import {
  FormCorrespondence,
  FormEntryInformation,
  FormOutcome,
  FormPhoneNumbers,
  FormPlacementExam,
  FormWaitingListVaccine,
  GridContainer,
} from "..";
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
  const theme = useTheme();
  const greaterThanMedium = useMediaQuery(theme.breakpoints.up("md"));

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
      <GridContainer>
        <Grid item md={5} xs={12}>
          <FormWaitingListVaccine disabled={disabled} />
        </Grid>
        <Grid item marginLeft={greaterThanMedium ? SPACING * 2 : 0} md={6.5} xs={12}>
          <FormOutcome disabled={disabled} />
        </Grid>
      </GridContainer>
      <Divider />
      <FormPlacementExam disabled={disabled} />
      <Divider />
      <FormCorrespondence disabled={disabled} selectedData={selectedWaitingListEntry} />
    </>
  );
};
