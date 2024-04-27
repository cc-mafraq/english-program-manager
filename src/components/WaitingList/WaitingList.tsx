import React, { RefObject, useMemo } from "react";
import { VirtualizedList, WaitingListCard } from "..";
import { useStudentStore, useWaitingListStore } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";
import { getWaitingListTimeStats } from "../../services";

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
  const students = useStudentStore((state) => {
    return state.students;
  });
  const waitingList = useWaitingListStore((state) => {
    return state.waitingList;
  });
  const scrollToIndex = useWaitingListStore((state) => {
    return state.scrollToIndex;
  });
  const setScrollToIndex = useWaitingListStore((state) => {
    return state.setScrollToIndex;
  });

  const waitingListTimeStats = useMemo(() => {
    return getWaitingListTimeStats(waitingList, students);
  }, [students, waitingList]);

  return (
    <VirtualizedList
      idPath="id"
      listData={filteredWaitingList}
      menuRef={menuRef}
      overscan={250}
      scrollToIndex={scrollToIndex}
      setScrollToIndex={setScrollToIndex}
    >
      <WaitingListCard
        handleWLEntryDialogOpen={handleWLEntryDialogOpen}
        waitingListTimeStats={waitingListTimeStats}
      />
    </VirtualizedList>
  );
};
