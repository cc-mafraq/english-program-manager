import { every, first } from "lodash";
import React, { RefObject } from "react";
import { ClassListStudentCard } from "..";
import { Student } from "../../interfaces";
import { VirtualizedList } from "../reusables";

interface ClassListProps {
  filteredStudents: Student[];
  menuRef: RefObject<HTMLDivElement>;
}

export const ClassList: React.FC<ClassListProps> = ({ filteredStudents, menuRef }) => {
  const firstStudent = first(filteredStudents);
  const allSameLevel = every(filteredStudents, (student) => {
    return student.currentLevel.substring(0, 2) === firstStudent?.currentLevel.substring(0, 2);
  });
  const allSameGender = every(filteredStudents, (student) => {
    return student.gender === firstStudent?.gender;
  });

  return (
    <VirtualizedList idPath="epId" listData={filteredStudents} menuRef={menuRef} overscan={500}>
      <ClassListStudentCard allSameGender={allSameGender} allSameLevel={allSameLevel} />
    </VirtualizedList>
  );
};
