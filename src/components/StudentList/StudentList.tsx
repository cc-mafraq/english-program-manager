import React, { RefObject, useMemo } from "react";
import { StudentCard } from "..";
import { useStudentStore } from "../../hooks";
import { Student } from "../../interfaces";
import { getActivePrimaryPhoneCounts, getPhoneCounts } from "../../services";
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
  const students = useStudentStore((state) => {
    return state.students;
  });
  const phoneCounts = useMemo(() => {
    return getPhoneCounts(students);
  }, [students]);
  const primaryPhoneCounts = useMemo(() => {
    return getActivePrimaryPhoneCounts(students);
  }, [students]);

  return (
    <VirtualizedList idPath="epId" listData={filteredStudents} menuRef={menuRef} overscan={500}>
      <StudentCard
        handleStudentDialogOpen={handleStudentDialogOpen}
        phoneCounts={phoneCounts}
        primaryPhoneCounts={primaryPhoneCounts}
      />
    </VirtualizedList>
  );
};
