import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps } from "@mui/material";
import { dropRight, filter, first, includes, last, map, sortBy, uniq } from "lodash";
import React, { useMemo } from "react";
import { useAppStore, useStudentStore } from "../../hooks";
import { SectionPlacement, Student } from "../../interfaces";
import { getClassName, getClassOptions, getSessionFullName } from "../../services";

interface ClassAndSessionSelectProps {
  classSelectSxProps?: SxProps;
  handleClassChange: (event: SelectChangeEvent) => void;
  handleSessionChange: (event: SelectChangeEvent) => void;
  includeAllOption?: boolean;
  noCSWL?: boolean;
  selectedClass?: SectionPlacement;
  selectedSession?: Student["initialSession"];
  sessionOptions: Student["initialSession"][];
  sessionSelectSxProps?: SxProps;
}

export const ClassAndSessionSelect: React.FC<ClassAndSessionSelectProps> = ({
  selectedClass,
  selectedSession,
  sessionOptions,
  handleSessionChange,
  handleClassChange,
  sessionSelectSxProps,
  classSelectSxProps,
  includeAllOption,
  noCSWL,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const students = useStudentStore((state) => {
    return state.students;
  });

  const classOptions = useMemo(() => {
    return filter(
      sortBy(
        uniq(
          map(getClassOptions(students, selectedSession ?? first(sessionOptions)), (classOption) => {
            return getClassName(classOption);
          }),
        ),
      ),
      (classOption) => {
        return role === "admin" && !noCSWL ? true : !includes(classOption, "CSWL");
      },
    );
  }, [noCSWL, role, selectedSession, sessionOptions, students]);

  return (
    <>
      <Box sx={sessionSelectSxProps}>
        <FormControl fullWidth>
          <InputLabel id="session-label">Session</InputLabel>
          <Select
            id="session-select"
            label="Session"
            labelId="session-label"
            onChange={handleSessionChange}
            value={sessionOptions.length ? selectedSession || first(sessionOptions) : ""}
          >
            {map(sessionOptions, (so) => {
              return (
                <MenuItem key={so} value={so}>
                  {import.meta.env.VITE_PROJECT_NAME === "ccm-english" ? getSessionFullName(so) : so}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      {includes(
        last(sessionOptions)?.includes("17") ? dropRight(sessionOptions, 20) : sessionOptions,
        selectedSession,
      ) && (
        <Box sx={classSelectSxProps}>
          <FormControl fullWidth>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              displayEmpty
              id="class-select"
              label="Class"
              labelId="class-label"
              onChange={handleClassChange}
              value={classOptions.length ? getClassName(selectedClass) ?? (includeAllOption ? "All" : "") : ""}
            >
              {map(includeAllOption ? ["All", ...classOptions] : classOptions, (classOption) => {
                return (
                  <MenuItem key={classOption} value={classOption}>
                    {classOption}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      )}
    </>
  );
};

ClassAndSessionSelect.defaultProps = {
  classSelectSxProps: undefined,
  includeAllOption: undefined,
  noCSWL: undefined,
  selectedClass: undefined,
  selectedSession: undefined,
  sessionSelectSxProps: undefined,
};
