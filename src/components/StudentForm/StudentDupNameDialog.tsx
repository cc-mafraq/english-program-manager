import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import { DialogProps, useColors } from "../../hooks";
import { Student } from "../../interfaces";

interface StudentDupNameDialogProps {
  data: Student;
  handleDialogClose: DialogProps["onClose"];
  handleSearchStringChange: (newString: string) => void;
  handleStudentDialogClose: () => void;
  matchedStudentId?: Student["epId"];
  onSubmit: (data: Student) => void;
  open: boolean;
}

export const StudentDupNameDialog: React.FC<StudentDupNameDialogProps> = ({
  open,
  handleDialogClose,
  handleStudentDialogClose,
  handleSearchStringChange,
  onSubmit,
  data,
  matchedStudentId,
}) => {
  const { popoverColor } = useColors();

  return (
    <Dialog
      disableEscapeKeyDown
      onClose={(_, reason) => {
        return handleDialogClose(reason);
      }}
      open={open}
      PaperProps={{
        style: {
          backgroundColor: popoverColor,
          overflowX: "hidden",
        },
      }}
    >
      <DialogTitle>Are you sure you want to add this entry?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          The name you entered is already registered in the student database. If you are sure this is a different
          person, then continue. Otherwise, click &quot;No&quot; and edit the older entry.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleDialogClose("submit");
            onSubmit(data);
          }}
        >
          Yes
        </Button>
        <Button
          autoFocus
          onClick={() => {
            handleDialogClose("submit");
            handleStudentDialogClose();
            matchedStudentId && handleSearchStringChange(matchedStudentId.toString());
          }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
