import React, { ChangeEvent, useState } from "react";
import { StudentDatabaseToolbar, StudentList } from "../components";
import { Student } from "../interfaces";
import { spreadsheetToStudentList } from "../services/spreadsheetService";

export const StudentDatabasePage = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const studentList = spreadsheetToStudentList(studentListString);
      setStudents(studentList);
    };
  };

  return (
    <>
      <input accept=".csv" id="fileSelect" onChange={onInputChange} type="file" />
      <StudentDatabaseToolbar />
      <StudentList students={students} />
    </>
  );
};
