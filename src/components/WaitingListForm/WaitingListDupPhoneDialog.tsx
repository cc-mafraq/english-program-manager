import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import { useColors } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";

interface WaitingListDupPhoneDialogProps {
  data: WaitingListEntry;
  handleDialogClose: () => void;
  onSubmit: (data: WaitingListEntry) => void;
  open: boolean;
}

export const WaitingListDupPhoneDialog: React.FC<WaitingListDupPhoneDialogProps> = ({
  open,
  handleDialogClose,
  onSubmit,
  data,
}) => {
  const { popoverColor } = useColors();

  return (
    <Dialog
      onClose={handleDialogClose}
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
          The primary phone number you entered is already in the waiting list. If this is a new person with the
          same number as an older entry (e.g. a brother or a sister), then continue. Otherwise, click
          &quot;No&quot; and edit the older entry.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleDialogClose();
            onSubmit(data);
          }}
        >
          Yes
        </Button>
        <Button autoFocus onClick={handleDialogClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
