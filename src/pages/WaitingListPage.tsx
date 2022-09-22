import { Box } from "@mui/material";
import React, { ChangeEvent, useContext, useRef } from "react";
import { ActionsMenu, CustomToolbar } from "../components";
import { usePageState } from "../hooks";
import { AppContext } from "../interfaces";
import { searchWaitingList, waitingListToList } from "../services";

export const WaitingListPage = () => {
  const {
    appState: { waitingList },
    appDispatch,
  } = useContext(AppContext);
  const waitingListRef = useRef(waitingList);
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
  } = usePageState({ listRef: waitingListRef, payloadPath: "waitingList", searchFn: searchWaitingList });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const newWaitingList = waitingListToList(studentListString);
      appDispatch({ payload: { waitingList: newWaitingList } });
    };
  };

  return (
    <>
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSearchStringChange={handleSearchStringChange}
          list={searchString ? filteredWaitingList : waitingList}
          page={page}
          rowsPerPage={rowsPerPage}
          searchPlaceholder="Search waiting list"
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
        />
        <ActionsMenu onInputChange={onInputChange} showActions={showActions} />
      </Box>
      {JSON.stringify(waitingListPage)}
    </>
  );
};
