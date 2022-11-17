import { Autocomplete, Button, Dialog, Paper, TextField, Typography, useTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { useStore } from "zustand";
import { AppContext } from "../../App";
import { useColors } from "../../hooks";
import { getStudentById, getStudentOptions } from "../../services";

interface SelectStudentDialogProps {
  handleDialogClose: () => void;
  handleStudentDialogOpen: () => void;
  open: boolean;
  setValue: Dispatch<SetStateAction<string | null>>;
  value: string | null;
}

export const SelectStudentDialog: React.FC<SelectStudentDialogProps> = ({
  handleDialogClose,
  handleStudentDialogOpen,
  open,
  value,
  setValue,
}) => {
  const { popoverColor } = useColors();
  const theme = useTheme();
  const store = useContext(AppContext);
  const students = useStore(store, (state) => {
    return state.students;
  });
  const setSelectedStudent = useStore(store, (state) => {
    return state.setSelectedStudent;
  });

  const onSubmit = () => {
    if (!value) return;
    setSelectedStudent(getStudentById(Number(value.slice(0, 5)), students));
    handleDialogClose();
    handleStudentDialogOpen();
  };

  return (
    <Dialog
      onClose={handleDialogClose}
      open={open}
      PaperProps={{ style: { backgroundColor: popoverColor, overflowX: "hidden" } }}
    >
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">Select a Student to Edit</Typography>
        <Autocomplete
          onChange={(event, newValue: string | null) => {
            setValue(newValue);
          }}
          openOnFocus
          options={getStudentOptions(students)}
          renderInput={(params) => {
            return <TextField label="Selected Student" variant="outlined" {...params} />;
          }}
          sx={{ margin: theme.spacing(2, 0, 2, 0), width: "40vw" }}
        />
        <Button
          className="update-button"
          onClick={onSubmit}
          sx={{
            "&:hover": {
              backgroundColor: green[900],
            },
            backgroundColor: green[800],
            color: theme.palette.mode === "light" ? "white" : grey[200],
          }}
          variant="contained"
        >
          Open
        </Button>
      </Paper>
    </Dialog>
  );
};
