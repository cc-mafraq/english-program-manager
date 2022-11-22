import { Box } from "@mui/material";
import React, { useCallback, useState } from "react";
import { loadLocal, useFinalGradeReportStore, useStudentStore } from "../../hooks";
import { Student } from "../../interfaces";
import { CustomToolbar } from "../reusables";
import { StudentDatabaseActions } from "../StudentList";
import { StudentFilter } from "./StudentFilter";

interface StudentDatabaseToolbarProps {
  filteredStudents: Student[];
  handleSearchStringChange: (value: string) => void;
  handleStudentDialogOpen: () => void;
}

export const StudentDatabaseToolbar: React.FC<StudentDatabaseToolbarProps> = ({
  filteredStudents,
  handleSearchStringChange,
  handleStudentDialogOpen,
}) => {
  const filter = useStudentStore((state) => {
    return state.filter;
  });
  const setFGRDialogOpen = useFinalGradeReportStore((state) => {
    return state.setOpen;
  });
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);

  const handleFGRDialogOpen = useCallback(() => {
    setFGRDialogOpen(true);
  }, [setFGRDialogOpen]);

  return (
    <Box position="sticky" top={0} zIndex={5}>
      <CustomToolbar
        filter={filter}
        filterComponent={<StudentFilter />}
        handleDialogOpen={handleStudentDialogOpen}
        handleSearchStringChange={handleSearchStringChange}
        list={filteredStudents}
        otherActions={
          <StudentDatabaseActions
            handleDialogOpen={handleStudentDialogOpen}
            handleGenerateFGRClick={handleFGRDialogOpen}
          />
        }
        setShowActions={setShowActions}
        showActions={showActions}
        tooltipObjectName="Students"
      />
    </Box>
  );
};
