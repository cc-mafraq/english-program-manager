import React, { useCallback, useRef } from "react";
import { Loading, MenuBar, WaitingList, WaitingListFormDialog, WaitingListToolbar } from "../components";
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

  const menuRef = useRef<HTMLDivElement>(null);

  const {
    filteredList: filteredWaitingList,
    handleSearchStringChange,
    searchString,
  } = usePageState<WaitingListEntry>({
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
      <MenuBar innerRef={menuRef} pageName="Waiting List" />
      <WaitingListToolbar
        filteredWaitingList={filteredWaitingList}
        handleSearchStringChange={handleSearchStringChange}
        handleWLEntryDialogOpen={handleWLEntryDialogOpen}
        searchString={searchString}
      />
      <Loading />
      <WaitingList
        filteredWaitingList={filteredWaitingList}
        handleWLEntryDialogOpen={handleWLEntryDialogOpen}
        menuRef={menuRef}
      />
      <WaitingListFormDialog handleSearchStringChange={handleSearchStringChange} />
    </>
  );
};
