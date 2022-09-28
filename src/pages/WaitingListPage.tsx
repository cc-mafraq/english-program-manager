import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import React, { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import {
  ActionsMenu,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
  FormDialog,
  Loading,
  VirtualizedList,
  WaitingListCardHeader,
  WaitingListEntryInfo,
  WaitingListForm,
} from "../components";
import { WaitingListFilter } from "../components/WaitingList/WaitingListFilter";
import { useFormDialog, usePageState } from "../hooks";
import { AppContext, emptyWaitingListEntry, WaitingListEntry } from "../interfaces";
import {
  removeNullFromObject,
  searchWaitingList,
  setData,
  setPrimaryNumberBooleanArray,
  sortWaitingList,
  waitingListFormSchema,
  waitingListToList,
} from "../services";

export const WaitingListPage = () => {
  const {
    appState: { waitingList, role, waitingListFilter: filter, selectedWaitingListEntry },
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

  const {
    handleDialogClose: handleWLEntryDialogClose,
    handleDialogOpen: handleWLEntryDialogOpen,
    openDialog: openWLEntryDialog,
  } = useFormDialog({ selectedDataPath: "selectedWaitingListEntry" });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangePage(null, 0);
    setSpreadsheetIsLoading(true);
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && appDispatch({ payload: { loading: true } });
    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const waitingListString = String(reader.result);
      const newWaitingList = await waitingListToList(waitingListString);
      appDispatch({ payload: { loading: false, waitingList: newWaitingList } });
      setSpreadsheetIsLoading(false);
    };
  };

  const wlEntryFormOnSubmit = useCallback(
    (data: WaitingListEntry) => {
      const primaryPhone = data.phoneNumbers[data.primaryPhone as number]?.number;
      if (primaryPhone) {
        data.primaryPhone = primaryPhone;
      } else {
        // eslint-disable-next-line no-alert
        alert("You must choose a primary phone number.");
        return;
      }
      const dataNoNull = removeNullFromObject(data) as WaitingListEntry;
      setData(dataNoNull, "waitingList", "id");
      !selectedWaitingListEntry && handleSearchStringChange(dataNoNull.primaryPhone.toString());
      handleWLEntryDialogClose();
    },
    [handleSearchStringChange, handleWLEntryDialogClose, selectedWaitingListEntry],
  );

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
          header={
            <WaitingListCardHeader data={emptyWaitingListEntry} handleEditEntryClick={handleWLEntryDialogOpen} />
          }
          noTabs={role !== "admin"}
          tabContents={[
            { component: <WaitingListEntryInfo data={emptyWaitingListEntry} />, label: "Entry" },
            {
              component: (
                <CorrespondenceList collectionName="waitingList" data={emptyWaitingListEntry} idPath="id" />
              ),
              hidden: role !== "admin",
              label: "Correspondence",
            },
          ]}
        />
      </VirtualizedList>
      <FormDialog
        dialogProps={{
          fullScreen: true,
          sx: {
            width: "100%",
          },
        }}
        handleDialogClose={handleWLEntryDialogClose}
        onSubmit={wlEntryFormOnSubmit}
        open={openWLEntryDialog}
        stickySubmit
        useFormProps={{
          defaultValues: setPrimaryNumberBooleanArray(selectedWaitingListEntry, "phoneNumbers"),
          resolver: yupResolver(waitingListFormSchema),
        }}
      >
        <WaitingListForm />
      </FormDialog>
    </>
  );
};
