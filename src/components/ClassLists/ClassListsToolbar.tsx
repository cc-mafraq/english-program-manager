import { AppBar, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Toolbar } from "@mui/material";
import { filter, includes, map, sortBy, uniq } from "lodash";
import React, { useMemo } from "react";
import { useAppStore } from "../../hooks";
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
  const role = useAppStore((state) => {
    return state.role;
  });

  const sessionOptions = useMemo(() => {
    return getAllSessions(students);
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
                return (
                  <MenuItem key={classOption} value={classOption}>
                    {classOption}
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
