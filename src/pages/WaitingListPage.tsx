import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { get, includes, map, nth } from "lodash";
import React, { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import { v4 } from "uuid";
import {
  ActionsMenu,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
  FormDialog,
  Loading,
  VirtualizedList,
  WaitingListCardHeader,
  WaitingListDupPhoneDialog,
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

  const {
    handleDialogClose: handleDupPhoneDialogClose,
    handleDialogOpen: handleDupPhoneDialogOpen,
    openDialog: openDupPhoneDialog,
  } = useFormDialog({});

  const [submitData, setSubmitData] = useState(emptyWaitingListEntry);

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
      if (!data.id) data.id = v4();
      const dataNoNull = removeNullFromObject(data) as WaitingListEntry;
      setData(dataNoNull, "waitingList", "id");
      !selectedWaitingListEntry && handleSearchStringChange(dataNoNull.primaryPhone.toString());
      handleWLEntryDialogClose();
    },
    [handleSearchStringChange, handleWLEntryDialogClose, selectedWaitingListEntry],
  );

  const checkDuplicatePhone = useCallback(
    (data: WaitingListEntry) => {
      const primaryPhone = get(nth(data?.phoneNumbers, data.primaryPhone as number), "number");
      primaryPhone && setSubmitData(data);
      if (primaryPhone) {
        data.primaryPhone = primaryPhone;
      }
      if (
        includes(map(waitingList, "primaryPhone"), data.primaryPhone ? data.primaryPhone : submitData.primaryPhone)
      ) {
        handleDupPhoneDialogOpen();
        return;
      }
      wlEntryFormOnSubmit(data.primaryPhone ? data : submitData);
    },
    [handleDupPhoneDialogOpen, submitData, waitingList, wlEntryFormOnSubmit],
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
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
          tooltipObjectName="Waiting List"
        />
        <ActionsMenu
          handleDialogOpen={handleWLEntryDialogOpen}
          noEditButton
          onInputChange={onInputChange}
          showActions={showActions}
          tooltipObjectName="Waiting List Entry"
        />
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
        onSubmit={checkDuplicatePhone}
        open={openWLEntryDialog}
        stickySubmit
        useFormProps={{
          defaultValues: setPrimaryNumberBooleanArray(selectedWaitingListEntry, "phoneNumbers"),
          resolver: yupResolver(waitingListFormSchema),
        }}
      >
        <WaitingListForm />
      </FormDialog>
      <WaitingListDupPhoneDialog
        data={submitData}
        handleDialogClose={handleDupPhoneDialogClose}
        onSubmit={wlEntryFormOnSubmit}
        open={openDupPhoneDialog}
      />
    </>
  );
};
