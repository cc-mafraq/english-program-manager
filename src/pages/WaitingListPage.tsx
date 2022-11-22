import React, { useCallback } from "react";
import { Loading, WaitingList, WaitingListFormDialog, WaitingListToolbar } from "../components";
import { usePageState, useWaitingListFormStore, useWaitingListStore } from "../hooks";
import { WaitingListEntry } from "../interfaces";
import { searchWaitingList, sortWaitingList } from "../services";

export const WaitingListPage = () => {
  const setWaitingList = useWaitingListStore((state) => {
    return state.setWaitingList;
  });
  const setWaitingListFormDialogOpen = useWaitingListFormStore((state) => {
    return state.setOpen;
  });
  const filter = useWaitingListStore((state) => {
    return state.filter;
  });

  const { filteredList: filteredWaitingList, handleSearchStringChange } = usePageState<WaitingListEntry>({
    collectionName: "waitingList",
    filter,
    requiredValuePath: "primaryPhone",
    searchFn: searchWaitingList,
    setData: setWaitingList,
    sortFn: sortWaitingList,
  });

  const handleWLEntryDialogOpen = useCallback(() => {
    setWaitingListFormDialogOpen(true);
  }, [setWaitingListFormDialogOpen]);

  return (
    <>
      <WaitingListToolbar
        filteredWaitingList={filteredWaitingList}
        handleSearchStringChange={handleSearchStringChange}
        handleWLEntryDialogOpen={handleWLEntryDialogOpen}
      />
      <Loading />
      <WaitingList filteredWaitingList={filteredWaitingList} handleWLEntryDialogOpen={handleWLEntryDialogOpen} />
      <WaitingListFormDialog handleSearchStringChange={handleSearchStringChange} />
    </>
  );
};
