import React, { RefObject } from "react";
import { StudentCard } from "..";
import { Student } from "../../interfaces";
import { VirtualizedList } from "../reusables";

interface StudentListProps {
  filteredStudents: Student[];
  handleStudentDialogOpen: () => void;
  menuRef: RefObject<HTMLDivElement>;
}

export const StudentList: React.FC<StudentListProps> = ({
  filteredStudents,
  handleStudentDialogOpen,
  menuRef,
}) => {
  return (
    <VirtualizedList idPath="epId" listData={filteredStudents} menuRef={menuRef} overscan={500}>
      <StudentCard handleStudentDialogOpen={handleStudentDialogOpen} />
    </VirtualizedList>
  );
};
