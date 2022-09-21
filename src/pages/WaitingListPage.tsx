import { Upload } from "@mui/icons-material";
import { Input, InputLabel } from "@mui/material";
import React, { ChangeEvent, useContext, useRef } from "react";
import { ActionFAB, CustomToolbar } from "../components";
import { usePageState } from "../hooks";
import { AppContext } from "../interfaces";
import { searchWaitingList, waitingListToList } from "../services";

export const WaitingListPage = () => {
  const {
    appState: { waitingList },
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
      <CustomToolbar
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleSearchStringChange={handleSearchStringChange}
        list={searchString ? filteredWaitingList : waitingList}
        page={page}
        rowsPerPage={rowsPerPage}
        searchString={searchString}
        setShowActions={setShowActions}
        showActions={showActions}
      />
      <InputLabel htmlFor="import-waiting-list">
        <Input
          id="import-waiting-list"
          inputProps={{ accept: [".txt", ".csv"] }}
          onChange={onInputChange}
          sx={{ display: "none" }}
          type="file"
        />
        <ActionFAB fabProps={{ component: "span" }} tooltipTitle="Import Waiting List">
          <Upload />
        </ActionFAB>
      </InputLabel>
      {JSON.stringify(waitingListPage)}
    </>
  );
};
