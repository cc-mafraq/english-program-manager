import { Box } from "@mui/material";
import { red as materialRed } from "@mui/material/colors";
import { join } from "lodash";
import React, { useContext, useMemo } from "react";
import { LabeledContainer, LabeledText } from "..";
import { useColors } from "../../hooks";
import { AppContext, CovidStatus, HighPriority, WaitingListEntry } from "../../interfaces";

interface WaitingListEntryInfoProps {
  data: WaitingListEntry;
}

export const WaitingListEntryInfo: React.FC<WaitingListEntryInfoProps> = ({ data: wlEntry }) => {
  const {
    appState: { role },
  } = useContext(AppContext);
  const { green, red } = useColors();
  const isAdminOrFaculty = role === "admin" || role === "faculty";

  const EntryInformation = useMemo(() => {
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
        <LabeledText label="Number of People">{wlEntry.numPeople}</LabeledText>
        <LabeledText label="Entry Date">{wlEntry.entryDate}</LabeledText>
        <LabeledText label="Entered in Phone">{wlEntry.enteredInPhone ? "Yes" : "No"}</LabeledText>
        <LabeledText label="Referral">{wlEntry.referral}</LabeledText>
        <LabeledText
          condition={wlEntry.covidStatus !== CovidStatus.NORPT}
          containerProps={{
            sx: {
              backgroundColor:
                wlEntry.covidStatus === CovidStatus.FULL
                  ? green
                  : wlEntry.covidStatus === CovidStatus.UNV
                  ? red
                  : undefined,
            },
          }}
          label="Vaccine Certificate Sent in WA"
        >
          {wlEntry.covidStatus === CovidStatus.FULL ? "Yes" : "No"}
        </LabeledText>
        <LabeledText label="Vaccine Notes">{wlEntry.covidVaccineNotes}</LabeledText>
        <LabeledText label="Placement Exam">{join(wlEntry.placementExam, " // ")}</LabeledText>
        <LabeledText
          containerProps={{
            sx: {
              backgroundColor:
                wlEntry.highPriority === HighPriority.YES
                  ? red
                  : wlEntry.highPriority === HighPriority.PAST
                  ? materialRed[200]
                  : undefined,
            },
          }}
          label="High Priority"
        >
          {wlEntry.highPriority === HighPriority.YES ? "Yes" : "No"}
        </LabeledText>
        <LabeledText label="Status">{wlEntry.status}</LabeledText>
        <LabeledText label="Probable PL1">{wlEntry.probPL1 ? "Yes" : undefined}</LabeledText>
        <LabeledText label="Probable L3+">{wlEntry.probL3Plus ? "Yes" : undefined}</LabeledText>
        <LabeledText label="Transferral DB">{wlEntry.transferralAndDate?.transferral}</LabeledText>
        <LabeledText label="Transferral Date">{wlEntry.transferralAndDate?.date}</LabeledText>
        <LabeledText label="Outcome">{wlEntry.outcome}</LabeledText>
      </LabeledContainer>
    );
  }, [
    green,
    isAdminOrFaculty,
    red,
    wlEntry.covidStatus,
    wlEntry.covidVaccineNotes,
    wlEntry.enteredInPhone,
    wlEntry.entryDate,
    wlEntry.highPriority,
    wlEntry.numPeople,
    wlEntry.outcome,
    wlEntry.placementExam,
    wlEntry.probL3Plus,
    wlEntry.probPL1,
    wlEntry.referral,
    wlEntry.status,
    wlEntry.transferralAndDate?.date,
    wlEntry.transferralAndDate?.transferral,
    wlEntry.waiting,
  ]);

  return <Box sx={{ display: "flex", flexWrap: "wrap" }}>{EntryInformation}</Box>;
};
