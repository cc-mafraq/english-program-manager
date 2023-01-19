import { filter as _filter, isArray } from "lodash";
import React, { useCallback, useRef } from "react";
import {
  FinalGradeReportDialog,
  Loading,
  MenuBar,
  StudentDatabaseToolbar,
  StudentFormDialog,
  StudentList,
} from "../components";
import { usePageState, useStudentFormStore, useStudentStore } from "../hooks";
import { Student } from "../interfaces";
import { searchStudents, sortStudents } from "../services";

export const StudentDatabasePage = () => {
  const filter = useStudentStore((state) => {
    return state.filter;
  });
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const setStudentDialogOpen = useStudentFormStore((state) => {
    return state.setOpen;
  });

  const menuRef = useRef<HTMLDivElement>(null);

  const handleStudentDialogOpen = useCallback(() => {
    setStudentDialogOpen(true);
  }, [setStudentDialogOpen]);

  const {
    filteredList: filteredStudents,
    handleSearchStringChange,
    searchString,
  } = usePageState<Student>({
    collectionName: "students",
    filter,
    requiredValuePath: "name.english",
    searchFn: searchStudents,
    setData: setStudents,
    sortFn: sortStudents,
  });

  return (
    <>
      <MenuBar innerRef={menuRef} pageName="Student Database" />
      <StudentDatabaseToolbar
        filteredStudents={filteredStudents}
        handleSearchStringChange={handleSearchStringChange}
        handleStudentDialogOpen={handleStudentDialogOpen}
        searchString={searchString}
      />
      <Loading />
      <StudentList
        filteredStudents={_filter(filteredStudents, (student) => {
          return isArray(student.placement);
        })}
        handleStudentDialogOpen={handleStudentDialogOpen}
        menuRef={menuRef}
      />
      <StudentFormDialog handleSearchStringChange={handleSearchStringChange} />
      <FinalGradeReportDialog />
    </>
  );
};
