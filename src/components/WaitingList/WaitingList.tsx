import React from "react";
import { VirtualizedList, WaitingListCard } from "..";
import { useWaitingListStore } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";

interface WaitingListProps {
  filteredWaitingList: WaitingListEntry[];
  handleWLEntryDialogOpen: () => void;
}

export const WaitingList: React.FC<WaitingListProps> = ({ filteredWaitingList, handleWLEntryDialogOpen }) => {
  const scrollToIndex = useWaitingListStore((state) => {
    return state.scrollToIndex;
  });
  const setScrollToIndex = useWaitingListStore((state) => {
    return state.setScrollToIndex;
  });

  return (
    <VirtualizedList
      defaultSize={275}
      idPath="id"
      listData={filteredWaitingList}
      scrollToIndex={scrollToIndex}
      setScrollToIndex={setScrollToIndex}
    >
      <WaitingListCard handleWLEntryDialogOpen={handleWLEntryDialogOpen} />
    </VirtualizedList>
  );
};
