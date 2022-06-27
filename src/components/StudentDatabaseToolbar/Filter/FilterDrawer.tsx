import { Box, Button, Drawer, Typography, useTheme } from "@mui/material";
import { map, sortBy, uniq } from "lodash";
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
      return getStatusDetails({ sessions: sessionsWithResults, student });
    },
    [sessionsWithResults],
  );

  const filterFields: FilterField[] = useMemo(() => {
    return [
      { name: "Invite", path: "status.inviteTag", values: booleanCheckboxOptions },
      { name: "Current Level", path: "currentLevel", values: [...genderedLevels, "L5 GRAD"] },
      { name: "Current Status", path: "status.currentStatus", values: statuses },
      { name: "Initial Session", path: "initialSession", values: getAllSessions(students) },
      { name: "Nationality", path: "nationality", values: nationalities },
      { name: "Gender", path: "gender", values: ["Male", "Female"] },
      { name: "Teacher", path: "work.isTeacher", values: ["Yes"] },
      { name: "English Teacher", path: "work.isEnglishTeacher", values: ["Yes"] },
      { name: "Placement Pending", path: "placement.pending", values: ["Yes"] },
      { fn: statusDetailsFn, name: "Status Details", path: "statusDetails", values: statusDetails },
      { name: "COVID Vaccine Status", path: "covidVaccine.status", values: covidStatuses },
      { name: "Dropped Out Reason", path: "status.droppedOutReason" },
      { name: "Number of Classes Taken", path: "academicRecords.length" },
    ];
  }, [statusDetailsFn, students]);

  const handleClearFilters = () => {
    appDispatch({ payload: { filter: [] } });
  };

  return (
    <Drawer
      onClose={handleClose}
      open={open}
      PaperProps={{ style: { backgroundColor: popoverColor, maxWidth: 250, paddingRight: 10 } }}
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
