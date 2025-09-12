import { every, first } from "lodash";
import React, { RefObject, useMemo } from "react";
import { ClassListStudentCard } from "..";
import { useStudentStore } from "../../hooks";
import { SectionPlacement, Student } from "../../interfaces";
import { getActivePrimaryPhoneCounts, getPhoneCounts } from "../../services";
import { VirtualizedList } from "../reusables";

interface ClassListProps {
  filteredStudents: Student[];
  menuRef: RefObject<HTMLDivElement>;
  selectedClass?: SectionPlacement;
  selectedSession?: string;
}

export const ClassList: React.FC<ClassListProps> = ({
  filteredStudents,
  menuRef,
  selectedSession,
  selectedClass,
}) => {
  const firstStudent = first(filteredStudents);
  const allSameLevel = every(filteredStudents, (student) => {
    return student.currentLevel.substring(0, 2) === firstStudent?.currentLevel.substring(0, 2);
  });
  const allSameGender = every(filteredStudents, (student) => {
    return student.gender === firstStudent?.gender;
  });

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
      <ClassListStudentCard
        allSameGender={allSameGender}
        allSameLevel={allSameLevel}
        phoneCounts={phoneCounts}
        primaryPhoneCounts={primaryPhoneCounts}
        selectedClass={selectedClass}
        selectedSession={selectedSession}
      />
    </VirtualizedList>
  );
};
