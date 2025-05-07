import React from "react";
import { useDatabase, useStudentStore } from "../../hooks";

interface StudentDatabaseWrapperProps {
  children: React.ReactNode;
}

export const StudentDatabaseWrapper: React.FC<StudentDatabaseWrapperProps> = ({ children }) => {
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  useDatabase({ collectionName: "students", setData: setStudents });

  return <>{children}</>;
};
