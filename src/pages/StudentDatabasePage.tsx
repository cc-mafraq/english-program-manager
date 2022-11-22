import React, { useCallback } from "react";
import {
  FinalGradeReportDialog,
  Loading,
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

  const handleStudentDialogOpen = useCallback(() => {
    setStudentDialogOpen(true);
  }, [setStudentDialogOpen]);

  const { filteredList: filteredStudents, handleSearchStringChange } = usePageState<Student>({
    collectionName: "students",
    filter,
    requiredValuePath: "name.english",
    searchFn: searchStudents,
    setData: setStudents,
    sortFn: sortStudents,
  });

  return (
    <>
      <StudentDatabaseToolbar
        filteredStudents={filteredStudents}
        handleSearchStringChange={handleSearchStringChange}
        handleStudentDialogOpen={handleStudentDialogOpen}
      />
      <Loading />
      <StudentList filteredStudents={filteredStudents} handleStudentDialogOpen={handleStudentDialogOpen} />
      <StudentFormDialog handleSearchStringChange={handleSearchStringChange} />
      <FinalGradeReportDialog />
    </>
  );
};
