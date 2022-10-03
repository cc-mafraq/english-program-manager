import { MoveDown } from "@mui/icons-material";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { useFormDialog } from "../../hooks";
import { AppContext } from "../../interfaces";
import { ActionFAB } from "../reusables";
import { JumpToEntryDialog } from "./JumpToEntryDialog";

interface WaitingListActionsProps {
  setScrollToIndex: Dispatch<SetStateAction<number | undefined>>;
}

export const WaitingListActions: React.FC<WaitingListActionsProps> = ({ setScrollToIndex }) => {
  const {
    appState: { role },
  } = useContext(AppContext);

  const {
    handleDialogClose: handleJumpToEntryDialogClose,
    handleDialogOpen: handleJumpToEntryDialogOpen,
    openDialog: openJumpToEntryDialog,
  } = useFormDialog({});

  return (
    <>
      {(role === "admin" || role === "faculty") && (
        <ActionFAB onClick={handleJumpToEntryDialogOpen} tooltipTitle="Jump to Entry">
          <MoveDown />
        </ActionFAB>
      )}
      <JumpToEntryDialog
        handleDialogClose={handleJumpToEntryDialogClose}
        open={openJumpToEntryDialog}
        submitValue={setScrollToIndex}
      />
    </>
  );
};
