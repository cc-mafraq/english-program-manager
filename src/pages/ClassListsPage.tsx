import { SelectChangeEvent } from "@mui/material";
import { filter, orderBy } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ClassList, ClassListsToolbar, MenuBar } from "../components";
import { useStudentStore } from "../hooks";
import { SectionPlacement } from "../interfaces";
import { getClassFromClassName, getCurrentSession, getSectionPlacement } from "../services";

export const ClassListsPage = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const students = useStudentStore((state) => {
    return state.students;
  });

  const currentSession = useMemo(() => {
    return getCurrentSession(students);
  }, [students]);

  const [selectedSession, setSelectedSession] = useState(currentSession);
  const [selectedClass, setSelectedClass] = useState<SectionPlacement>({ level: "PL1-M" });

  const filteredStudents = useMemo(() => {
    return orderBy(
      filter(students, (student) => {
        return !!getSectionPlacement(student, selectedSession, selectedClass);
      }),
      [
        (student) => {
          return getSectionPlacement(student, selectedSession, selectedClass)?.timestamp;
        },
        "name.english",
      ],
    );
  }, [selectedClass, selectedSession, students]);

  const handleSessionChange = useCallback((event: SelectChangeEvent) => {
    setSelectedSession(event.target.value);
  }, []);

  const handleClassChange = useCallback((event: SelectChangeEvent) => {
    setSelectedClass(getClassFromClassName(event.target.value));
  }, []);

  return (
    <>
      <MenuBar innerRef={menuRef} pageName="Class Lists" />
      <ClassListsToolbar
        handleClassChange={handleClassChange}
        handleSessionChange={handleSessionChange}
        selectedClass={selectedClass}
        selectedSession={selectedSession}
        students={students}
      />
      <ClassList filteredStudents={filteredStudents} menuRef={menuRef} />
    </>
  );
};
