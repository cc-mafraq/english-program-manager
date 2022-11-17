import { MoveDown } from "@mui/icons-material";
import React, { Dispatch, SetStateAction } from "react";
import { useAppStore, useFormDialog } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";
import { ActionFAB } from "../reusables";
import { JumpToEntryDialog } from "./JumpToEntryDialog";

interface WaitingListActionsProps {
  filteredWaitingList: WaitingListEntry[];
  setScrollToIndex: Dispatch<SetStateAction<number | undefined>>;
}

export const WaitingListActions: React.FC<WaitingListActionsProps> = ({
  setScrollToIndex,
  filteredWaitingList,
}) => {
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
        submitValue={setScrollToIndex}
      />
    </>
  );
};
