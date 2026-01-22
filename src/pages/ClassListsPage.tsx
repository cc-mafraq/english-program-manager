import { SelectChangeEvent, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { every, filter, find, includes, map, orderBy, replace, some } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClassList, ClassListsToolbar, MenuBar } from "../components";
import { loadLocal, saveLocal, useAppStore, useStudentStore } from "../hooks";
import { FinalResult, SectionPlacement, Student } from "../interfaces";
import { getClassFromClassName, getCurrentSession, getSectionPlacement, setData, setFilePaths } from "../services";

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

  const placementsSet = useRef(false);

  useEffect(() => {
    const setImageandPlacementURLs = async () => {
      if (!placementsSet.current && students.length) {
        const studentsWithNewImages = await setFilePaths(students, "imageName", "studentPics");
        console.log("finished setting image URLs");
        const studentsWithNewImagesAndPlacements = await setFilePaths(
          studentsWithNewImages,
          "origPlacementData.examFile",
          "placementExams",
        );
        console.log("finished setting placement URLs");
        try {
          await Promise.all(
            map(studentsWithNewImagesAndPlacements, async (student) => {
              console.log(`updating URLs for ${student.epId}`);
              await setData(student, "students", "epId", { merge: true });
              console.log(`finished updating URLs for ${student.epId}`);
            }),
          );
        } catch (e) {
          console.error(e);
        }
        console.log("COMPLETE");
      }
    };
    setImageandPlacementURLs();
    placementsSet.current = true;
  }, [placementsSet, students]);

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
        return ar.session === selectedSession && includes(ar.level ?? ar.levelAudited, selectedClass?.level);
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
    setSelectedClass(getClassFromClassName(event.target.value) ?? { level: "PL1-M" });
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
