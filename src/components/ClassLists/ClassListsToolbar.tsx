import { AppBar, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Toolbar } from "@mui/material";
import { map } from "lodash";
import React, { useMemo } from "react";
import { SectionPlacement, Student } from "../../interfaces";
import { getAllSessions, getClassName, getClassOptions, getSessionFullName } from "../../services";

interface ClassListsToolbarProps {
  handleClassChange: (e: SelectChangeEvent) => void;
  handleSessionChange: (e: SelectChangeEvent) => void;
  selectedClass: SectionPlacement;
  selectedSession: Student["initialSession"];
  students: Student[];
}

export const ClassListsToolbar: React.FC<ClassListsToolbarProps> = ({
  students,
  selectedSession,
  selectedClass,
  handleSessionChange,
  handleClassChange,
}) => {
  const sessionOptions = useMemo(() => {
    return getAllSessions(students);
  }, [students]);

  const classOptions = useMemo(() => {
    return getClassOptions(students, selectedSession);
  }, [selectedSession, students]);

  return (
    <AppBar color="default" elevation={1} position="relative">
      <Toolbar
        sx={{
          justifyContent: "space-evenly",
          paddingTop: "1vh",
        }}
      >
        <Box sx={{ width: "25%" }}>
          <FormControl fullWidth>
            <InputLabel id="session-label">Session</InputLabel>
            <Select
              id="session-select"
              label="Session"
              labelId="session-label"
              onChange={handleSessionChange}
              value={selectedSession}
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
        <Box sx={{ width: "25%" }}>
          <FormControl fullWidth>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              id="class-select"
              label="Class"
              labelId="class-label"
              onChange={handleClassChange}
              value={getClassName(selectedClass)}
            >
              {map(classOptions, (classOption) => {
                const wholelevel = getClassName(classOption);
                return (
                  <MenuItem key={wholelevel} value={wholelevel}>
                    {wholelevel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
