import { Box } from "@mui/material";
import React, { useState } from "react";
import { WaitingListActions, WaitingListCounter, WaitingListFilter } from "..";
import { loadLocal, useAppStore, useWaitingListStore } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";
import { CustomToolbar } from "../reusables";

interface WaitingListToolbarProps {
  filteredWaitingList: WaitingListEntry[];
  handleSearchStringChange: (value: string) => void;
  handleWLEntryDialogOpen: () => void;
  searchString: string;
}

export const WaitingListToolbar: React.FC<WaitingListToolbarProps> = ({
  handleWLEntryDialogOpen,
  handleSearchStringChange,
  filteredWaitingList,
  searchString,
}) => {
  const filter = useWaitingListStore((state) => {
    return state.filter;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);

  return (
    <>
      <WaitingListCounter />
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          addButtonCondition={role === "faculty"}
          addButtonTooltip="Add Waiting List Entry"
          filter={filter}
          filterComponent={<WaitingListFilter />}
          handleDialogOpen={handleWLEntryDialogOpen}
          handleSearchStringChange={handleSearchStringChange}
          list={filteredWaitingList}
          otherActions={<WaitingListActions filteredWaitingList={filteredWaitingList} />}
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
          tooltipObjectName="Waiting List"
        />
      </Box>
    </>
  );
};
