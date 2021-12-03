import React, { ChangeEvent, useState } from "react";
import { FinalGradeReportDialog, StudentDatabaseToolbar, StudentList } from "../components";
import { Student } from "../interfaces";
import { getStudentPage, searchStudents } from "../services";
import { spreadsheetToStudentList } from "../services/spreadsheetService";

export const StudentDatabasePage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [studentsPage, setStudentsPage] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [openFGRDialog, setOpenFGRDialog] = useState(false);
  const [searchString, setSearchString] = useState<string>("");

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    setStudentsPage(getStudentPage(filteredStudents, newPage, rowsPerPage));
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setStudentsPage(getStudentPage(filteredStudents, 0, newRowsPerPage));
  };

  const handleSearchStringChange = (value: string) => {
    const filStudents = searchStudents(students, value);
    setSearchString(value);
    setPage(0);
    setStudentsPage(getStudentPage(filStudents, 0, rowsPerPage));
    setFilteredStudents(filStudents);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const studentList = spreadsheetToStudentList(studentListString);
      const filStudents = searchStudents(studentList, searchString);
      setStudents(studentList);
      setFilteredStudents(filStudents);
      setStudentsPage(getStudentPage(filStudents, page, rowsPerPage));
    };
  };

  const handleGenerateFGRClick = () => {
    setOpenFGRDialog(true);
  };

  const handleFGRDialogClose = () => {
    setOpenFGRDialog(false);
  };

  return (
    <>
      <StudentDatabaseToolbar
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleGenerateFGRClick={handleGenerateFGRClick}
        handleImportClick={onInputChange}
        handleSearchStringChange={handleSearchStringChange}
        page={page}
        rowsPerPage={rowsPerPage}
        students={filteredStudents}
      />
      {students.length > 0 ? (
        <FinalGradeReportDialog
          handleDialogClose={handleFGRDialogClose}
          open={openFGRDialog}
          students={students}
        />
      ) : (
        <></>
      )}
      <StudentList studentsPage={studentsPage} />
    </>
  );
};
