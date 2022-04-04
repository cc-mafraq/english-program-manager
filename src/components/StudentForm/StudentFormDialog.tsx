import { Box, Dialog } from "@mui/material";
import React from "react";
import { useColors } from "../../hooks";
import { StudentForm } from "./StudentForm";

interface StudentFormDialogProps {
  handleDialogClose: () => void;
  open: boolean;
}

export const StudentFormDialog: React.FC<StudentFormDialogProps> = ({ handleDialogClose, open }) => {
  const { popoverColor } = useColors();

  return (
    <Dialog
      fullScreen
      onClose={handleDialogClose}
      open={open}
      PaperProps={{
        style: {
          backgroundColor: popoverColor,
          overflowX: "hidden",
        },
      }}
      sx={{
        width: "100%",
      }}
    >
      <Box sx={{ padding: "10px" }}>
        <StudentForm handleDialogClose={handleDialogClose} />
      </Box>
    </Dialog>
  );
};
