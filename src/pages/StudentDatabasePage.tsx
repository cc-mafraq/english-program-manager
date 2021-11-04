import React, { ChangeEvent, useState } from "react";
import { FinalGradeReportDialog, StudentDatabaseToolbar, StudentList } from "../components";
import { Student } from "../interfaces";
import { getStudentPage } from "../services";
import { spreadsheetToStudentList } from "../services/spreadsheetService";

export const StudentDatabasePage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsPage, setStudentsPage] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [openFGRDialog, setOpenFGRDialog] = useState(false);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    setStudentsPage(getStudentPage(students, newPage, rowsPerPage));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setStudentsPage(getStudentPage(students, 0, newRowsPerPage));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const studentList = spreadsheetToStudentList(studentListString);
      setStudents(studentList);
      setStudentsPage(getStudentPage(studentList, page, rowsPerPage));
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
        page={page}
        rowsPerPage={rowsPerPage}
        students={students}
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
