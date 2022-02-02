import { Box, Dialog } from "@mui/material";
import React from "react";

interface StudentFormDialogProps {
  handleDialogClose: () => void;
  open: boolean;
}

export const StudentFormDialog: React.FC<StudentFormDialogProps> = ({
  handleDialogClose,
  open,
}) => {
  return (
    <Dialog
      fullScreen
      onClose={handleDialogClose}
      open={open}
      PaperProps={{ style: { backgroundColor: "#f5f5f5", overflowX: "hidden" } }}
      sx={{
        marginLeft: "50%",
        marginTop: "5%",
        transform: "translate(-50%)",
        width: "90%",
      }}
    >
      <Box sx={{ padding: "10px" }} />
    </Dialog>
  );
};
