import { SelectChangeEvent } from "@mui/material";
import { filter, orderBy } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClassList, ClassListsToolbar, MenuBar } from "../components";
import { loadLocal, saveLocal, useAppStore, useStudentStore } from "../hooks";
import { SectionPlacement } from "../interfaces";
import { getClassFromClassName, getCurrentSession, getSectionPlacement } from "../services";

export const ClassListsPage = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const students = useStudentStore((state) => {
    return state.students;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const navigate = useNavigate();

  const currentSession = useMemo(() => {
    return getCurrentSession(students);
  }, [students]);

  const [selectedSession, setSelectedSession] = useState(currentSession);
  const [selectedClass, setSelectedClass] = useState<SectionPlacement | undefined>(
    getClassFromClassName(loadLocal("classListSelection") ?? ""),
  );

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
    saveLocal("classListSelection", event.target.value);
    setSelectedClass(getClassFromClassName(event.target.value) ?? { level: "PL1-M" });
  }, []);

  useEffect(() => {
    if (students.length === 0) navigate("/epd", { replace: true });
  }, [navigate, students]);

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
      <ClassList
        filteredStudents={role === "admin" || role === "faculty" ? filteredStudents : []}
        menuRef={menuRef}
      />
    </>
  );
};
