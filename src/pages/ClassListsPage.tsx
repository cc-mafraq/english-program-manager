import { SelectChangeEvent, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { every, filter, find, includes, orderBy, replace, some } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClassList, ClassListsToolbar, MenuBar } from "../components";
import { loadLocal, saveLocal, useAppStore, useStudentStore } from "../hooks";
import { FinalResult, SectionPlacement, Student } from "../interfaces";
import { getClassFromClassName, getCurrentSession, getSectionPlacement } from "../services";

export const ClassListsPage = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const students = useStudentStore((state) => {
    return state.students;
  });
  const role = useAppStore((state) => {
    return state.role;
  });

  const [selectedSession, setSelectedSession] = useState<string | undefined>(
    loadLocal("sessionSelection") ?? undefined,
  );

  const [selectedClass, setSelectedClass] = useState<SectionPlacement | undefined>(
    getClassFromClassName(loadLocal("classListSelection") ?? ""),
  );
  const [showWDStudents, setShowWDStudents] = useState(!!(loadLocal("showWDStudents") ?? true));

  // const placementsSet = useRef(false);

  // useEffect(() => {
  //   if (!placementsSet.current && students.length) {
  //     setPlacementExamFilePaths(students);
  //     placementsSet.current = true;
  //   }
  // }, [placementsSet, students]);

  useEffect(() => {
    if (students.length && selectedSession === undefined) {
      setSelectedSession(getCurrentSession(students));
    }
  }, [selectedSession, students]);

  const filteredStudents = useMemo(() => {
    return orderBy(
      filter(students, (student) => {
        const academicRecord = find(student.academicRecords, (ar) => {
          const academicRecordLevelNoGender = replace(ar.level ?? ar.levelAudited ?? "", /-M|-W/g, "");
          return (
            ar.session === selectedSession &&
            selectedClass !== undefined &&
            (academicRecordLevelNoGender === selectedClass?.level ||
              (ar?.level ?? ar?.levelAudited) === selectedClass?.level)
          );
        });
        return (
          !!getSectionPlacement(student, selectedSession, selectedClass) &&
          (showWDStudents || academicRecord?.overallResult !== FinalResult.WD)
        );
      }),
      selectedClass?.section === "CSWL"
        ? [
            (student) => {
              return getSectionPlacement(student, selectedSession, selectedClass)?.timestamp;
            },
            "name.english",
          ]
        : "name.english",
    );
  }, [selectedClass, selectedSession, showWDStudents, students]);

  const studentHasResult = useCallback(
    (filteredStudent: Student) => {
      return find(filteredStudent.academicRecords, (ar) => {
        return ar.session === selectedSession && includes(ar.level, selectedClass?.level);
      })?.overallResult;
    },
    [selectedClass?.level, selectedSession],
  );

  const gradesAreStarted = useMemo(() => {
    return some(
      filter(filteredStudents, (filteredStudent) => {
        return (
          find(filteredStudent.academicRecords, (ar) => {
            return ar.session === selectedSession && includes(ar.level, selectedClass?.level);
          })?.overallResult !== "WD"
        );
      }),
      studentHasResult,
    );
  }, [filteredStudents, selectedClass?.level, selectedSession, studentHasResult]);

  const gradesAreComplete = useMemo(() => {
    return every(filteredStudents, studentHasResult);
  }, [filteredStudents, studentHasResult]);

  const handleSessionChange = useCallback((event: SelectChangeEvent) => {
    saveLocal("sessionSelection", event.target.value);
    setSelectedSession(event.target.value);
  }, []);

  const handleClassChange = useCallback((event: SelectChangeEvent) => {
    saveLocal("classListSelection", event.target.value);
    setSelectedClass(
      import.meta.env.VITE_PROJECT_NAME === "ccm-english"
        ? getClassFromClassName(event.target.value) ?? { level: "PL1-M" }
        : { level: event.target.value },
    );
  }, []);

  const handleShowWDCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    saveLocal("showWDStudents", event.target.checked);
    setShowWDStudents(event.target.checked);
  }, []);

  return (
    <>
      <MenuBar innerRef={menuRef} pageName="Class Lists" />
      <ClassListsToolbar
        filteredStudents={filteredStudents}
        handleClassChange={handleClassChange}
        handleSessionChange={handleSessionChange}
        handleShowWDCheckboxChange={handleShowWDCheckboxChange}
        selectedClass={selectedClass}
        selectedSession={selectedSession}
        showWDStudents={showWDStudents}
      />
      {gradesAreStarted && (
        <Typography
          color={gradesAreComplete ? green[700] : red[700]}
          fontWeight="bold"
          marginLeft="10px"
          variant="h6"
        >
          {gradesAreComplete ? "Complete" : "Incomplete"}
        </Typography>
      )}
      <ClassList
        filteredStudents={role === "admin" || role === "faculty" ? filteredStudents : []}
        menuRef={menuRef}
        selectedClass={selectedClass}
        selectedSession={selectedSession}
      />
    </>
  );
};
