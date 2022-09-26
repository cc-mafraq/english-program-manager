import { Box } from "@mui/material";
import React, { ChangeEvent, useContext, useRef, useState } from "react";
import {
  ActionsMenu,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
  Loading,
  VirtualizedList,
  WaitingListCardHeader,
  WaitingListEntryInfo,
} from "../components";
import { WaitingListFilter } from "../components/WaitingList/WaitingListFilter";
import { usePageState } from "../hooks";
import { AppContext, emptyWaitingListEntry } from "../interfaces";
import { searchWaitingList, sortWaitingList, waitingListToList } from "../services";

export const WaitingListPage = () => {
  const {
    appState: { waitingList, role, waitingListFilter: filter },
    appDispatch,
  } = useContext(AppContext);
  const waitingListRef = useRef(waitingList);
  waitingListRef.current = waitingList;
  const [spreadsheetIsLoading, setSpreadsheetIsLoading] = useState(false);
  const {
    filteredList: filteredWaitingList,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchStringChange,
    listPage: waitingListPage,
    page,
    rowsPerPage,
    searchString,
    setShowActions,
    showActions,
  } = usePageState({
    collectionName: "waitingList",
    conditionToAddPath: "primaryPhone",
    filter,
    listRef: waitingListRef,
    payloadPath: "waitingList",
    searchFn: searchWaitingList,
    sortFn: sortWaitingList,
    spreadsheetIsLoading,
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangePage(null, 0);
    setSpreadsheetIsLoading(true);
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && appDispatch({ payload: { loading: true } });
    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const waitingListString = String(reader.result);
      await waitingListToList(waitingListString);
      appDispatch({ payload: { loading: false } });
      setSpreadsheetIsLoading(false);
    };
  };

  return (
    <>
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          filterComponent={<WaitingListFilter />}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSearchStringChange={handleSearchStringChange}
          list={searchString || filter.length ? filteredWaitingList : waitingList}
          page={page}
          rowsPerPage={rowsPerPage}
          searchPlaceholder="Search waiting list"
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
        />
        <ActionsMenu onInputChange={onInputChange} showActions={showActions} />
      </Box>
      <Loading />
      <VirtualizedList defaultSize={275} deps={[role]} idPath="id" page={waitingListPage}>
        <CustomCard
          data={emptyWaitingListEntry}
          header={<WaitingListCardHeader data={emptyWaitingListEntry} handleEditEntryClick={() => {}} />}
          noTabs={role !== "admin"}
          tabContents={[
            { component: WaitingListEntryInfo, label: "Entry" },
            { component: CorrespondenceList, hidden: role !== "admin", label: "Correspondence" },
          ]}
        />
      </VirtualizedList>
    </>
  );
};
