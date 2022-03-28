import { List, ListItem } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { StudentCard } from ".";
import { Student } from "../../interfaces";

interface StudentListProps {
  handleEditStudentClick: () => void;
  studentsPage: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({ studentsPage, handleEditStudentClick }) => {
  return (
    <List>
      {map(studentsPage, (student) => {
        return (
          <ListItem key={student.epId}>
            <StudentCard handleEditStudentClick={handleEditStudentClick} student={student} />
          </ListItem>
        );
      })}
    </List>
  );
};
