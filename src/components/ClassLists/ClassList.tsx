import React, { RefObject } from "react";
import { ClassListStudentCard } from "..";
import { Student } from "../../interfaces";
import { VirtualizedList } from "../reusables";

interface ClassListProps {
  filteredStudents: Student[];
  menuRef: RefObject<HTMLDivElement>;
}

export const ClassList: React.FC<ClassListProps> = ({ filteredStudents, menuRef }) => {
  return (
    <VirtualizedList idPath="epId" listData={filteredStudents} menuRef={menuRef} overscan={500}>
      <ClassListStudentCard />
    </VirtualizedList>
  );
};
