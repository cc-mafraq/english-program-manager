/* eslint-disable react/prop-types */
import { Box, useTheme } from "@mui/material";
import { grey, red as materialRed } from "@mui/material/colors";
import { isEqual, map } from "lodash";
import React from "react";
import { LabeledContainer, LabeledText } from "..";
import { useAppStore, useColors } from "../../hooks";
import { CovidStatus, HighPriority, WaitingListEntry } from "../../interfaces";

interface WaitingListEntryInfoProps {
  data: WaitingListEntry;
}

const equalProps = (prevProps: WaitingListEntryInfoProps, nextProps: WaitingListEntryInfoProps) => {
  return isEqual(prevProps, nextProps);
};

const EntryInformation: React.FC<WaitingListEntryInfoProps> = React.memo(({ data: wlEntry }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const { green, red, defaultBackgroundColor } = useColors();
  const theme = useTheme();
  const isAdminOrFaculty = role === "admin" || role === "faculty";

  return (
    <LabeledContainer condition={isAdminOrFaculty} label="Entry Information">
      <LabeledText
        containerProps={{
          sx: {
            backgroundColor: wlEntry.waiting ? green : red,
          },
        }}
        label="Waiting"
      >
        {wlEntry.waiting ? "Yes" : "No"}
      </LabeledText>
      <LabeledText
        containerProps={{
          sx: {
            backgroundColor:
              wlEntry.highPriority === HighPriority.YES
                ? red
                : wlEntry.highPriority === HighPriority.PAST
                ? theme.palette.mode === "dark"
                  ? materialRed[200]
                  : "rgb(255,210,210)"
                : defaultBackgroundColor,
          },
        }}
        label="High Priority"
        labelProps={{
          color:
            theme.palette.mode === "dark" && wlEntry.highPriority === HighPriority.PAST
              ? grey[800]
              : theme.palette.text.secondary,
        }}
        textProps={{
          color:
            theme.palette.mode === "dark" && wlEntry.highPriority === HighPriority.PAST
              ? grey[900]
              : theme.palette.text.primary,
        }}
      >
        {wlEntry.highPriority === HighPriority.YES
          ? "Yes"
          : wlEntry.highPriority === HighPriority.PAST
          ? "Past"
          : "No"}
      </LabeledText>
      <LabeledText condition={wlEntry.numPeople > 1} label="Number of People">
        {wlEntry.numPeople}
      </LabeledText>
      <LabeledText label="Entry Date">{wlEntry.entryDate}</LabeledText>
      <LabeledText condition={wlEntry.enteredInPhone !== undefined} label="Entered in Phone">
        {wlEntry.enteredInPhone ? "Yes" : "No"}
      </LabeledText>
      <LabeledText label="Referral">{wlEntry.referral}</LabeledText>
      <LabeledText label="Probable PL1">{wlEntry.probPL1 ? "Yes" : undefined}</LabeledText>
      <LabeledText label="Probable L3+">{wlEntry.probL3Plus ? "Yes" : undefined}</LabeledText>
      <LabeledText label="Transferral DB">{wlEntry.transferralAndDate?.transferral}</LabeledText>
      <LabeledText label="Transferral Date">{wlEntry.transferralAndDate?.date}</LabeledText>
      <LabeledText label="Outcome">{wlEntry.outcome}</LabeledText>
    </LabeledContainer>
  );
}, equalProps);
EntryInformation.displayName = "Entry Information";

const PhoneNumbers: React.FC<WaitingListEntryInfoProps> = React.memo(({ data: wlEntry }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";

  return (
    <LabeledContainer condition={isAdminOrFaculty} label="Phone Numbers" showWhenEmpty>
      {map(wlEntry.phoneNumbers, (pn, i) => {
        return (
          <span key={i}>
            <LabeledText label={`Number ${Number(i) + 1}`}>{pn.number}</LabeledText>
            <LabeledText label={`Number ${Number(i) + 1} Notes`}>{pn.notes}</LabeledText>
          </span>
        );
      })}
    </LabeledContainer>
  );
}, equalProps);
PhoneNumbers.displayName = "Phone Numbers";

const PlacementExam: React.FC<WaitingListEntryInfoProps> = React.memo(({ data: wlEntry }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";

  return (
    <LabeledContainer condition={wlEntry.placementExam?.length > 0 && isAdminOrFaculty} label="Placement Exam">
      {map(wlEntry.placementExam, (pe, i) => {
        return (
          <span key={i}>
            <LabeledText label="">{pe}</LabeledText>
          </span>
        );
      })}
    </LabeledContainer>
  );
}, equalProps);
PlacementExam.displayName = "Placement Exam";

const CovidVaccine: React.FC<WaitingListEntryInfoProps> = React.memo(({ data: wlEntry }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  return (
    <LabeledContainer condition={role === "admin"} label="COVID Vaccine">
      <LabeledText label="Certificate in WA">
        {wlEntry.covidStatus === CovidStatus.FULL || wlEntry.covidStatus === CovidStatus.BOOST
          ? "Yes"
          : wlEntry.covidStatus === CovidStatus.EXEMPT
          ? "Exempt"
          : "No"}
      </LabeledText>
      <LabeledText label="Vaccine Notes">{wlEntry.covidVaccineNotes}</LabeledText>
    </LabeledContainer>
  );
}, equalProps);
CovidVaccine.displayName = "Covid Vaccine";

export const WaitingListEntryInfo: React.FC<WaitingListEntryInfoProps> = ({ data: wlEntry }) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <EntryInformation data={wlEntry} />
      <PhoneNumbers data={wlEntry} />
      <PlacementExam data={wlEntry} />
      <CovidVaccine data={wlEntry} />
    </Box>
  );
};
