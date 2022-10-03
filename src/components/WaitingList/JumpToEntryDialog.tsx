import { Button, Dialog, Paper, TextField, Typography, useTheme } from "@mui/material";
import { findIndex } from "lodash";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { loadLocal, saveLocal, useColors } from "../../hooks";
import { AppContext } from "../../interfaces";
import { phoneConditionFn } from "../../services";

interface JumpToEntryDialogProps {
  handleDialogClose: () => void;
  open: boolean;
  submitValue: Dispatch<SetStateAction<number | undefined>>;
}

export const JumpToEntryDialog: React.FC<JumpToEntryDialogProps> = ({ handleDialogClose, open, submitValue }) => {
  const { popoverColor } = useColors();
  const theme = useTheme();
  const {
    appState: { waitingList },
  } = useContext(AppContext);
  const [value, setValue] = useState<string | undefined>(loadLocal("jumpPhone"));

  const onSubmit = () => {
    if (!value) return;
    saveLocal("jumpPhone", value);
    const scrollToIndex = findIndex(waitingList, (wle) => {
      return !!phoneConditionFn(value)(wle.primaryPhone);
    });
    scrollToIndex !== -1 && submitValue(scrollToIndex);
    handleDialogClose();
  };

  return (
    <Dialog
      onClose={handleDialogClose}
      open={open}
      PaperProps={{ style: { backgroundColor: popoverColor, overflowX: "hidden" } }}
    >
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6">Enter a phone number to jump to the entry:</Typography>
        <TextField
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Phone Number"
          sx={{ margin: theme.spacing(2, 0, 2, 0), width: "40vw" }}
          value={value}
        />
        <Button
          onClick={onSubmit}
          sx={{
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            backgroundColor: theme.palette.primary.main,
          }}
          type="button"
          variant="contained"
        >
          Jump
        </Button>
      </Paper>
    </Dialog>
  );
};
