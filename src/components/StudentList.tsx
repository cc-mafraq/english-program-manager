import { List, ListItem } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { StudentCard } from ".";
import { Student } from "../interfaces";

export const StudentList = ({ studentsPage }: { studentsPage: Student[] }) => {
  return (
    <List>
      {map(studentsPage, (student) => {
        return (
          <ListItem key={student.epId}>
            <StudentCard student={student} />
          </ListItem>
        );
      })}
    </List>
  );
};
