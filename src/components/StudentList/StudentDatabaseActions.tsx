import { Cached, Edit } from "@mui/icons-material";
import React, { useState } from "react";
import { SelectStudentDialog } from "..";
import { useAppStore } from "../../hooks";
import { ActionFAB } from "../reusables";

interface StudentDatabaseActionsProps {
  handleDialogOpen: () => void;
  handleGenerateFGRClick: () => void;
}

export const StudentDatabaseActions: React.FC<StudentDatabaseActionsProps> = ({
  handleGenerateFGRClick,
  handleDialogOpen,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const [openSelectDialog, setOpenSelectDialog] = useState(false);
  const [selectValue, setSelectValue] = useState<string | null>(null);

  const handleSelectDialogOpen = () => {
    setOpenSelectDialog(true);
  };

  const handleSelectDialogClose = () => {
    setSelectValue(null);
    setOpenSelectDialog(false);
  };

  return (
    <>
      {role === "admin" && (
        <ActionFAB onClick={handleSelectDialogOpen} tooltipTitle="Edit Student">
          <Edit />
        </ActionFAB>
      )}
      {(role === "admin" || role === "faculty") && handleGenerateFGRClick && (
        <ActionFAB onClick={handleGenerateFGRClick} tooltipTitle="Generate Final Grade Reports">
          <Cached />
        </ActionFAB>
      )}
      <SelectStudentDialog
        handleDialogClose={handleSelectDialogClose}
        handleStudentDialogOpen={handleDialogOpen}
        open={openSelectDialog}
        setValue={setSelectValue}
        value={selectValue}
      />
    </>
  );
};
