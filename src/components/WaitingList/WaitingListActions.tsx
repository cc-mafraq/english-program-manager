import { MoveDown } from "@mui/icons-material";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { useFormDialog } from "../../hooks";
import { AppContext, WaitingListEntry } from "../../interfaces";
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
        filteredWaitingList={filteredWaitingList}
        handleDialogClose={handleJumpToEntryDialogClose}
        open={openJumpToEntryDialog}
        submitValue={setScrollToIndex}
      />
    </>
  );
};
