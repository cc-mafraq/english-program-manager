import { Download } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  SelectChangeEvent,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import download from "downloadjs";
import { dropRight, every, filter, findIndex, first, map, nth, reduce } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useAppStore, useStudentStore } from "../../hooks";
import { SectionPlacement, Student } from "../../interfaces";
import { getAllSessionsWithRecord, getClassName, getStatusDetails } from "../../services";
import { ClassAndSessionSelect } from "./ClassAndSessionSelect";

interface ClassListsToolbarProps {
  filteredStudents: Student[];
  handleClassChange: (e: SelectChangeEvent) => void;
  handleSessionChange: (e: SelectChangeEvent) => void;
  handleShowWDCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedClass?: SectionPlacement;
  selectedSession?: Student["initialSession"];
  showWDStudents: boolean;
}

export const ClassListsToolbar: React.FC<ClassListsToolbarProps> = ({
  filteredStudents,
  selectedSession,
  selectedClass,
  showWDStudents,
  handleSessionChange,
  handleClassChange,
  handleShowWDCheckboxChange,
}) => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const role = useAppStore((state) => {
    return state.role;
  });

  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const sessionOptions = useMemo(() => {
    return dropRight(getAllSessionsWithRecord(students), 20);
  }, [students]);

  const generateClassListNotes = useCallback(
    (student: Student) => {
      const sessionIndex = findIndex(student.placement, (placement) => {
        return placement.session === selectedSession;
      });
      const classIndex = findIndex(nth(student.placement, sessionIndex)?.placement, (sectionPlacement) => {
        return getClassName(selectedClass) === getClassName(sectionPlacement);
      });

      return `${
        every(filteredStudents, (fs) => {
          return fs.gender === first(filteredStudents)?.gender;
        })
          ? ""
          : `${student.gender === "M" ? "Male" : "Female"}. `
      }${
        student.currentLevel === selectedClass?.level ||
        every(filteredStudents, (fs) => {
          return fs.currentLevel === first(filteredStudents)?.currentLevel;
        })
          ? ""
          : `${student.currentLevel}. `
      }${
        student.currentLevel.includes("PL1") && student.literacy.illiterateEng ? "Struggling with literacy. " : ""
      }${map(student.placement[sessionIndex].placement[classIndex].classListNotes, (c) => {
        return `${c.date}: ${c.notes}\n`;
      })}`;
    },
    [filteredStudents, selectedClass, selectedSession],
  );

  const exportClassList = useCallback(() => {
    const classListCSV = reduce(
      filteredStudents,
      (csvString, student) => {
        return `${csvString}"${student.name.english.replaceAll('"', "'")}","${generateClassListNotes(student)}","${
          student.name.arabic
        }",${student.epId},${student.status.currentStatus},"${getStatusDetails({ student, students })[0]}",${
          student.phone.primaryPhone
        },${
          first(
            filter(student.phone.phoneNumbers, (pn) => {
              return pn.number !== student.phone.primaryPhone;
            }),
          )?.number ?? ""
        },${student.nationality}\n`;
      },
      "",
    );
    download(`data:text/plain,${classListCSV}`, `${getClassName(selectedClass)}.csv`, "text/plain");
  }, [filteredStudents, generateClassListNotes, selectedClass, students]);

  return (
    <AppBar color="default" elevation={1} position="relative">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingTop: "1vh",
        }}
      >
        {role === "admin" && greaterThanSmall && (
          <Tooltip title="Export Class List">
            <IconButton onClick={exportClassList} size="small">
              <Download />
            </IconButton>
          </Tooltip>
        )}
        <ClassAndSessionSelect
          classSelectSxProps={{ width: greaterThanSmall ? "25%" : "35%" }}
          handleClassChange={handleClassChange}
          handleSessionChange={handleSessionChange}
          selectedClass={selectedClass}
          selectedSession={selectedSession}
          sessionOptions={sessionOptions}
          sessionSelectSxProps={{ marginRight: "10px", width: greaterThanSmall ? "25%" : "35%" }}
        />
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
  selectedSession: undefined,
};
