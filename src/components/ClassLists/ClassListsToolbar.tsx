import {
  AppBar,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { dropRight, filter, includes, map, sortBy, uniq } from "lodash";
import React, { useMemo } from "react";
import { useAppStore } from "../../hooks";
import { SectionPlacement, Student } from "../../interfaces";
import { getAllSessions, getClassName, getClassOptions, getSessionFullName } from "../../services";

interface ClassListsToolbarProps {
  filteredStudents: Student[];
  handleClassChange: (e: SelectChangeEvent) => void;
  handleSessionChange: (e: SelectChangeEvent) => void;
  handleShowWDCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedClass?: SectionPlacement;
  selectedSession: Student["initialSession"];
  showWDStudents: boolean;
  students: Student[];
}

export const ClassListsToolbar: React.FC<ClassListsToolbarProps> = ({
  students,
  filteredStudents,
  selectedSession,
  selectedClass,
  showWDStudents,
  handleSessionChange,
  handleClassChange,
  handleShowWDCheckboxChange,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });

  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const sessionOptions = useMemo(() => {
    return dropRight(getAllSessions(students), 20);
  }, [students]);

  const classOptions = useMemo(() => {
    return filter(
      sortBy(
        uniq(
          map(getClassOptions(students, selectedSession), (classOption) => {
            return getClassName(classOption);
          }),
        ),
      ),
      (classOption) => {
        return role === "admin" ? true : !includes(classOption, "CSWL");
      },
    );
  }, [role, selectedSession, students]);

  return (
    <AppBar color="default" elevation={1} position="relative">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingTop: "1vh",
        }}
      >
        <Box sx={{ marginRight: "10px", width: greaterThanSmall ? "25%" : "35%" }}>
          <FormControl fullWidth>
            <InputLabel id="session-label">Session</InputLabel>
            <Select
              id="session-select"
              label="Session"
              labelId="session-label"
              onChange={handleSessionChange}
              value={sessionOptions.length ? selectedSession : ""}
            >
              {map(sessionOptions, (so) => {
                return (
                  <MenuItem key={so} value={so}>
                    {getSessionFullName(so)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: greaterThanSmall ? "25%" : "35%" }}>
          <FormControl fullWidth>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              displayEmpty
              id="class-select"
              label="Class"
              labelId="class-label"
              onChange={handleClassChange}
              value={classOptions.length ? getClassName(selectedClass) ?? "" : ""}
            >
              {map(classOptions, (classOption) => {
                return (
                  <MenuItem key={classOption} value={classOption}>
                    {classOption}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ alignItems: "center" }}>
          <FormControlLabel
            control={<Checkbox checked={showWDStudents} onChange={handleShowWDCheckboxChange} />}
            label="Show WD Students"
            sx={{ display: "flex", margin: "0 auto" }}
          />
        </Box>
        <Box textAlign="right">
          <Typography>{filteredStudents.length} students</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

ClassListsToolbar.defaultProps = {
  selectedClass: undefined,
};
