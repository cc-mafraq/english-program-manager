import { Box } from "@mui/material";
import React, { useState } from "react";
import { WaitingListActions, WaitingListCounter, WaitingListFilter } from "..";
import { loadLocal, useWaitingListStore } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";
import { CustomToolbar } from "../reusables";

interface WaitingListToolbarProps {
  filteredWaitingList: WaitingListEntry[];
  handleSearchStringChange: (value: string) => void;
  handleWLEntryDialogOpen: () => void;
}

export const WaitingListToolbar: React.FC<WaitingListToolbarProps> = ({
  handleWLEntryDialogOpen,
  handleSearchStringChange,
  filteredWaitingList,
}) => {
  const filter = useWaitingListStore((state) => {
    return state.filter;
  });
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);

  return (
    <>
      <WaitingListCounter />
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          addButtonTooltip="Add Waiting List Entry"
          filter={filter}
          filterComponent={<WaitingListFilter />}
          handleDialogOpen={handleWLEntryDialogOpen}
          handleSearchStringChange={handleSearchStringChange}
          list={filteredWaitingList}
          otherActions={<WaitingListActions filteredWaitingList={filteredWaitingList} />}
          setShowActions={setShowActions}
          showActions={showActions}
          tooltipObjectName="Waiting List"
        />
      </Box>
    </>
  );
};
