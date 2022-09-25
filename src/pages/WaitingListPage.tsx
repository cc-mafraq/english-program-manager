import { Box } from "@mui/material";
import React, { ChangeEvent, useContext, useEffect, useRef } from "react";
import {
  ActionsMenu,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
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
    setState,
  } = usePageState({ filter, listRef: waitingListRef, payloadPath: "waitingList", searchFn: searchWaitingList });

  useEffect(() => {
    setState({});
  }, [filter, setState]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const newWaitingList = waitingListToList(studentListString);
      appDispatch({ payload: { waitingList: sortWaitingList(newWaitingList) } });
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
