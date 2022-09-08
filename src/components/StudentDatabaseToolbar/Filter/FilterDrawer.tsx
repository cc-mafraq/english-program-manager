import { Box, Button, Drawer, Typography, useTheme } from "@mui/material";
import { first, includes, map, range, sortBy, uniq } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import { FilterCheckbox } from "..";
import { useColors } from "../../../hooks";
import {
  AppContext,
  covidStatuses,
  genderedLevels,
  nationalities,
  statusDetails,
  statuses,
  Student,
} from "../../../interfaces";
import { FilterField, getAllSessions, getSessionsWithResults, getStatusDetails } from "../../../services";

interface FilterDrawerProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const booleanCheckboxOptions = ["Yes", "No"];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);
  const {
    appState: { students },
    appDispatch,
  } = useContext(AppContext);
  const { popoverColor } = useColors();
  const theme = useTheme();
  const sessionsWithResults = getSessionsWithResults(students);

  const statusDetailsFn = useCallback(
    (student: Student) => {
      return getStatusDetails({ sessions: sessionsWithResults, student })[0];
    },
    [sessionsWithResults],
  );

  const sessionsAttendedFn = useCallback(
    (student: Student) => {
      return getStatusDetails({ sessions: sessionsWithResults, student })[1];
    },
    [sessionsWithResults],
  );

  const whatsAppGroupFn = useCallback((student: Student) => {
    const includesRemove = includes(student.phone.waBroadcastSAR?.toLowerCase(), "remove");
    if (includes(student.phone.waBroadcastSAR?.toLowerCase(), "group") && !includesRemove) {
      return (
        `SAR ${first(student.phone.waBroadcastSAR?.match(/Group \d/))}` ||
        `SAR Group ${first(student.phone.waBroadcastSAR?.match(/\d/))}`
      );
    }
    if (includes(student.phone.waBroadcastSAR, "Y") && !includesRemove) {
      return "SAR Group 1";
    }
    return "None";
  }, []);

  const filterFields: FilterField[] = useMemo(() => {
    return [
      { name: "Invite", path: "status.inviteTag", values: booleanCheckboxOptions },
      { name: "Placement Pending", path: "placement.pending", values: ["Yes"] },
      { name: "No Answer Class Schedule WPM", path: "placement.noAnswerClassScheduleWpm", values: ["Yes"] },
      { name: "Current Level", path: "currentLevel", values: [...genderedLevels, "L5 GRAD"] },
      { name: "Current Status", path: "status.currentStatus", values: statuses },
      { name: "COVID Vaccine Status", path: "covidVaccine.status", values: covidStatuses },
      { name: "Teacher", path: "work.isTeacher", values: ["Yes"] },
      { name: "English Teacher", path: "work.isEnglishTeacher", values: ["Yes"] },
      { name: "Initial Session", path: "initialSession", values: getAllSessions(students) },
      { name: "Nationality", path: "nationality", values: nationalities },
      { name: "Gender", path: "gender", values: ["Male", "Female"] },
      {
        fn: whatsAppGroupFn,
        name: "WA BC Group",
        path: "phone.waBroadcastSAR",
        values: ["None", "SAR Group 1", "SAR Group 2", "SAR Group 3", "SAR Group 4", "SAR Group 5", "SAR Group 6"],
      },
      { fn: statusDetailsFn, name: "Status Details", path: "statusDetails", values: statusDetails },
      { name: "Dropped Out Reason", path: "status.droppedOutReason" },
      { fn: sessionsAttendedFn, name: "Sessions Attended", path: "sessionsAttended", values: range(11) },
    ];
  }, [sessionsAttendedFn, statusDetailsFn, students, whatsAppGroupFn]);

  const handleClearFilters = () => {
    appDispatch({ payload: { filter: [] } });
  };

  return (
    <Drawer
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: { backgroundColor: popoverColor, maxWidth: 250, paddingLeft: "20px", paddingRight: 10 },
      }}
    >
      <Typography fontWeight="bold" marginLeft={1} marginTop={1} variant="h5">
        Filter Students
      </Typography>
      <Button
        color={theme.palette.mode === "light" ? "secondary" : undefined}
        onClick={handleClearFilters}
        sx={{
          borderRadius: 8,
          marginBottom: -3,
          marginLeft: theme.palette.mode === "light" ? "3%" : 0.5,
          marginTop: 1,
          width: theme.palette.mode === "light" ? "75%" : "60%",
        }}
        variant={theme.palette.mode === "light" ? "contained" : undefined}
      >
        Clear Filters
      </Button>
      <Box>
        {map(filterFields, (field, i) => {
          return (
            <Box key={`filter-field-${i}`} margin={1} marginTop={5}>
              <Typography fontSize={18} fontWeight="bold" marginBottom={0.5} width="100%">
                {field.name}
              </Typography>
              {map(field.values ? field.values : sortBy(uniq(map(students, field.path))), (val) => {
                return (
                  <FilterCheckbox key={`filter-field-${field.name}-${val}`} filterField={field} label={val} />
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
};
