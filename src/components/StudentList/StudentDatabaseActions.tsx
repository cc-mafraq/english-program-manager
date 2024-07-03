import { Cached, Edit, Upload } from "@mui/icons-material";
import { Input, InputLabel } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { SelectStudentDialog } from "..";
import { useAppStore, useStudentStore } from "../../hooks";
import { tunisiaSpreadsheetToStudentList } from "../../services";
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
  const setLoading = useAppStore((state) => {
    return state.setLoading;
  });
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const [openSelectDialog, setOpenSelectDialog] = useState(false);
  const [selectValue, setSelectValue] = useState<string | null>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && setLoading(true);
    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const newStudents = await tunisiaSpreadsheetToStudentList(studentListString);
      console.log(newStudents);
      setStudents(newStudents);
      setLoading(false);
    };
  };

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
        <>
          <ActionFAB onClick={handleSelectDialogOpen} tooltipTitle="Edit Student">
            <Edit />
          </ActionFAB>
          <InputLabel htmlFor="import-spreadsheet">
            <Input
              id="import-spreadsheet"
              inputProps={{ accept: ".csv" }}
              onChange={onInputChange}
              sx={{ display: "none" }}
              type="file"
            />
            <ActionFAB fabProps={{ component: "span" }} tooltipTitle="Import Spreadsheet">
              <Upload />
            </ActionFAB>
          </InputLabel>
        </>
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
