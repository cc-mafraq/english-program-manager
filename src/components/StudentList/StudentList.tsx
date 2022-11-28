import React from "react";
import { StudentCard } from "..";
import { Student } from "../../interfaces";
import { VirtualizedList } from "../reusables";

interface StudentListProps {
  filteredStudents: Student[];
  handleStudentDialogOpen: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({ filteredStudents, handleStudentDialogOpen }) => {
  return (
    <VirtualizedList idPath="epId" listData={filteredStudents}>
      <StudentCard handleStudentDialogOpen={handleStudentDialogOpen} />
    </VirtualizedList>
  );
};
