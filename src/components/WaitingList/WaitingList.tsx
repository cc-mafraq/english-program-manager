import React, { RefObject } from "react";
import { VirtualizedList, WaitingListCard } from "..";
import { useWaitingListStore } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";

interface WaitingListProps {
  filteredWaitingList: WaitingListEntry[];
  handleWLEntryDialogOpen: () => void;
  menuRef: RefObject<HTMLDivElement>;
}

export const WaitingList: React.FC<WaitingListProps> = ({
  filteredWaitingList,
  handleWLEntryDialogOpen,
  menuRef,
}) => {
  const scrollToIndex = useWaitingListStore((state) => {
    return state.scrollToIndex;
  });
  const setScrollToIndex = useWaitingListStore((state) => {
    return state.setScrollToIndex;
  });

  return (
    <VirtualizedList
      idPath="id"
      listData={filteredWaitingList}
      menuRef={menuRef}
      overscan={250}
      scrollToIndex={scrollToIndex}
      setScrollToIndex={setScrollToIndex}
    >
      <WaitingListCard handleWLEntryDialogOpen={handleWLEntryDialogOpen} />
    </VirtualizedList>
  );
};
