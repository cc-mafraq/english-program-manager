import { Edit, WhatsApp } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { useAppStore, useColors, useStudentStore, useWaitingListStore } from "../../hooks";
import { HighPriority, WaitingListEntry } from "../../interfaces";
import {
  WaitingListTimeStats,
  getNumActiveEligibleInFront,
  getPosition,
  getStudentIDByPhoneNumber,
} from "../../services";

interface WaitingListHeaderProps {
  data: WaitingListEntry;
  handleEditEntryClick: () => void;
  waitingListTimeStats: WaitingListTimeStats;
}

export const WaitingListCardHeader: React.FC<WaitingListHeaderProps> = ({
  data: wlEntry,
  handleEditEntryClick,
  waitingListTimeStats,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const waitingList = useWaitingListStore((state) => {
    return state.waitingList;
  });
  const students = useStudentStore((state) => {
    return state.students;
  });
  const setSelectedWaitingListEntry = useWaitingListStore((state) => {
    return state.setSelectedWaitingListEntry;
  });

  const matchingStudentID = useMemo(() => {
    return getStudentIDByPhoneNumber(students, wlEntry.primaryPhone);
  }, [students, wlEntry.primaryPhone]);

  const theme = useTheme();
  const { iconColor } = useColors();
  const position = getPosition(waitingList, wlEntry);
  const { newStudentRate, eligibleNewStudentRate, numHighPriority, numSpotsPerMonth } = waitingListTimeStats;
  const numActiveEligibleInFront = useMemo(() => {
    return getNumActiveEligibleInFront(waitingList, wlEntry);
  }, [waitingList, wlEntry]);
  const numMonthsWait = Math.round(
    // number of entries in front of this entry who are expected to become a new student and have not yet received the Eligibility WPM
    ((position - numActiveEligibleInFront - numHighPriority) * newStudentRate +
      // number of entries in front of this entry who are expected to become a new student and have received the Eligibility WPM
      numActiveEligibleInFront * eligibleNewStudentRate) /
      numSpotsPerMonth,
  );

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Box display="flex">
          <Typography fontSize={28}>{wlEntry.primaryPhone === -1 ? "No Number" : wlEntry.primaryPhone}</Typography>
        </Box>
        <Box display="flex" width="70%">
          {(role === "admin" || role === "faculty") && (
            <Typography fontSize={28} marginLeft="25%">
              {wlEntry.name}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex" }}>
          {wlEntry.primaryPhone > 700000000 ? (
            <>
              <Tooltip arrow title="Contact on WhatsApp">
                <IconButton href={`https://wa.me/962${wlEntry.primaryPhone}`} target="_blank">
                  <WhatsApp sx={{ color: iconColor }} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Typography display="inline" marginRight="5px" variant="h5">
              WA Number Invalid
            </Typography>
          )}
          {role === "admin" && (
            <Tooltip arrow title="Edit Waiting List Entry">
              <IconButton
                onClick={() => {
                  setSelectedWaitingListEntry(wlEntry);
                  handleEditEntryClick();
                }}
              >
                <Edit sx={{ color: iconColor }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      {wlEntry.waiting && (
        <Box display="flex" flexDirection="row" paddingBottom={1}>
          <Typography
            color={theme.palette.mode === "light" ? theme.palette.secondary.main : theme.palette.primary.light}
            variant="h6"
          >
            {`Position: ${position}`}
          </Typography>
          {matchingStudentID && (
            <Typography color={theme.palette.warning.main} marginLeft="5vw" variant="h6">
              Warning: Number already in student database ({matchingStudentID})
            </Typography>
          )}
          {wlEntry.highPriority === HighPriority.NO && (
            <Typography marginLeft="5vw" variant="h6">
              Estimated Wait Time: {wlEntry.highPriority === HighPriority.NO ? numMonthsWait : 0} month
              {numMonthsWait === 1 ? "" : "s"}
            </Typography>
          )}
        </Box>
      )}
      <Divider />
    </>
  );
};
