import { Edit, WhatsApp } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { filter, includes } from "lodash";
import moment from "moment";
import React, { useMemo } from "react";
import { useAppStore, useColors, useStudentStore, useWaitingListStore } from "../../hooks";
import { HighPriority, WaitingListEntry, WaitlistOutcome } from "../../interfaces";
import { MOMENT_FORMAT, getPosition, getStudentIDByPhoneNumber } from "../../services";

interface WaitingListHeaderProps {
  data: WaitingListEntry;
  handleEditEntryClick: () => void;
}

export const WaitingListCardHeader: React.FC<WaitingListHeaderProps> = ({
  data: wlEntry,
  handleEditEntryClick,
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
  const newStudentRate = useMemo(() => {
    return (
      filter(waitingList, (wle) => {
        return wle.outcome === WaitlistOutcome.N;
      }).length /
      filter(waitingList, (wle) => {
        return wle.outcome !== undefined;
      }).length
    );
  }, [waitingList]);
  const newStudentsPerMonth = students.length / moment().diff(moment("09-01-2017"), "months");
  const notWaitingLength = useMemo(() => {
    return filter(waitingList, (wle) => {
      return !wle.waiting && wle.outcome === WaitlistOutcome.N;
    }).length;
  }, [waitingList]);
  const numNewPastHighPriority = useMemo(() => {
    return filter(waitingList, (wle) => {
      return wle.highPriority === HighPriority.PAST && wle.outcome === WaitlistOutcome.N;
    }).length;
  }, [waitingList]);
  const overallHighPriorityRate = numNewPastHighPriority / notWaitingLength;
  const reactivatedRate = useMemo(() => {
    return (
      filter(waitingList, (wle) => {
        return (
          (includes(wle.placementExam, "NS") || includes(wle.placementExam, "NO RESPONSE")) &&
          wle.outcome === WaitlistOutcome.N
        );
      }).length / notWaitingLength
    );
  }, [notWaitingLength, waitingList]);
  const numActiveEligibleInFront = useMemo(() => {
    return filter(waitingList, (wle) => {
      return (
        wle.eligible &&
        wle.waiting &&
        wle.highPriority === HighPriority.NO &&
        moment(wle.entryDate, MOMENT_FORMAT) < moment(wlEntry.entryDate, MOMENT_FORMAT) &&
        (moment(wle.entryDate, MOMENT_FORMAT) !== moment(wlEntry.entryDate, MOMENT_FORMAT) ||
          (wle.timestamp ?? 0) < (wlEntry.timestamp ?? 1))
      );
    }).length;
  }, [waitingList, wlEntry.entryDate, wlEntry.timestamp]);
  const eligibleNewStudentRate = useMemo(() => {
    const numPreviousNewEligible = filter(waitingList, (wle) => {
      return wle.eligible && !wle.waiting && wle.outcome === WaitlistOutcome.N;
    }).length;
    return numPreviousNewEligible > 50
      ? numPreviousNewEligible /
          filter(waitingList, (wle) => {
            return wle.eligible && !wle.waiting;
          }).length
      : 2 / 3;
  }, [waitingList]);
  const numHighPriority = useMemo(() => {
    return filter(waitingList, (wle) => {
      return wle.highPriority !== HighPriority.NO && wle.waiting && wle.outcome === WaitlistOutcome.N;
    }).length;
  }, [waitingList]);
  const newHighPriorityRate = useMemo(() => {
    return (
      numNewPastHighPriority /
      filter(waitingList, (wle) => {
        return wle.highPriority === HighPriority.PAST;
      }).length
    );
  }, [numNewPastHighPriority, waitingList]);

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
              Estimated Wait Time:{" "}
              {wlEntry.highPriority === HighPriority.NO
                ? Math.round(
                    ((position - numActiveEligibleInFront - numHighPriority) * newStudentRate +
                      numActiveEligibleInFront * eligibleNewStudentRate) /
                      (newStudentsPerMonth * (1 - (overallHighPriorityRate + reactivatedRate))) +
                      (numHighPriority * newHighPriorityRate) / newStudentsPerMonth,
                  )
                : 0}{" "}
              months
            </Typography>
          )}
        </Box>
      )}
      <Divider />
    </>
  );
};
