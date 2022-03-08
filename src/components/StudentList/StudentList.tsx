import { List, ListItem } from "@mui/material";
import { map } from "lodash";
import React, { Dispatch, SetStateAction } from "react";
import { StudentCard } from ".";
import { Student } from "../../interfaces";

interface StudentListProps {
  handleEditStudentClick: () => void;
  setSelectedStudent: Dispatch<SetStateAction<Student | undefined>>;
  studentsPage: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({
  studentsPage,
  setSelectedStudent,
  handleEditStudentClick,
}) => {
  return (
    <List>
      {map(studentsPage, (student) => {
        return (
          <ListItem key={student.epId}>
            <StudentCard
              handleEditStudentClick={handleEditStudentClick}
              setSelectedStudent={setSelectedStudent}
              student={student}
            />
          </ListItem>
        );
      })}
    </List>
  );
};
