import { MoveDown } from "@mui/icons-material";
import React from "react";
import { useAppStore, useFormDialog } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";
import { ActionFAB } from "../reusables";
import { JumpToEntryDialog } from "./JumpToEntryDialog";

interface WaitingListActionsProps {
  filteredWaitingList: WaitingListEntry[];
}

export const WaitingListActions: React.FC<WaitingListActionsProps> = ({ filteredWaitingList }) => {
  const role = useAppStore((state) => {
    return state.role;
  });

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
        filteredWaitingList={filteredWaitingList}
        handleDialogClose={handleJumpToEntryDialogClose}
        open={openJumpToEntryDialog}
      />
    </>
  );
};
