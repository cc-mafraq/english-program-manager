import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { get, includes, map, nth } from "lodash";
import moment from "moment";
import React, { useCallback, useContext, useState } from "react";
import { v4 } from "uuid";
import { useStore } from "zustand";
import { AppContext } from "../App";
import {
  ActionsMenu,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
  FormDialog,
  Loading,
  VirtualizedList,
  WaitingListActions,
  WaitingListCardHeader,
  WaitingListCounter,
  WaitingListDupPhoneDialog,
  WaitingListEntryInfo,
  WaitingListFilter,
  WaitingListForm,
} from "../components";
import { useFormDialog, usePageState } from "../hooks";
import { emptyWaitingListEntry, WaitingListEntry } from "../interfaces";
import {
  removeNullFromObject,
  searchWaitingList,
  setData,
  setPrimaryNumberBooleanArray,
  sortWaitingList,
  waitingListFormSchema,
} from "../services";

export const WaitingListPage = () => {
  const store = useContext(AppContext);
  const waitingList = useStore(store, (state) => {
    return state.waitingList;
  });
  const selectedWaitingListEntry = useStore(store, (state) => {
    return state.selectedWaitingListEntry;
  });
  const role = useStore(store, (state) => {
    return state.role;
  });
  const filter = useStore(store, (state) => {
    return state.waitingListFilter;
  });

  const {
    filteredList: filteredWaitingList,
    handleSearchStringChange,
    listPage: waitingListPage,
    searchString,
    setShowActions,
    showActions,
  } = usePageState({
    collectionName: "waitingList",
    conditionToAddPath: "primaryPhone",
    filter,
    payloadPath: "waitingList",
    searchFn: searchWaitingList,
    sortFn: sortWaitingList,
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
  const [scrollToIndex, setScrollToIndex] = useState<undefined | number>(undefined);

  const wlEntryFormOnSubmit = useCallback(
    (data: WaitingListEntry) => {
      if (!data.id) data.id = v4();
      if (!selectedWaitingListEntry) data.timestamp = moment().format();
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
      data.primaryPhone = primaryPhone || submitData.primaryPhone;
      if (includes(map(waitingList, "primaryPhone"), data.primaryPhone) && !selectedWaitingListEntry) {
        primaryPhone && setSubmitData(data);
        handleDupPhoneDialogOpen();
      } else {
        wlEntryFormOnSubmit(data);
      }
    },
    [
      handleDupPhoneDialogOpen,
      selectedWaitingListEntry,
      submitData.primaryPhone,
      waitingList,
      wlEntryFormOnSubmit,
    ],
  );

  return (
    <>
      <WaitingListCounter />
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          filterComponent={<WaitingListFilter />}
          filterName="waitingListFilter"
          handleSearchStringChange={handleSearchStringChange}
          list={filteredWaitingList}
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
          tooltipObjectName="Waiting List"
        />
        <ActionsMenu
          handleDialogOpen={handleWLEntryDialogOpen}
          noEditButton
          otherActions={
            <WaitingListActions filteredWaitingList={filteredWaitingList} setScrollToIndex={setScrollToIndex} />
          }
          showActions={showActions}
          tooltipObjectName="Waiting List Entry"
        />
      </Box>
      <Loading />
      <VirtualizedList
        defaultSize={275}
        deps={[role]}
        idPath="id"
        page={waitingListPage}
        scrollToIndex={scrollToIndex}
        setScrollToIndex={setScrollToIndex}
      >
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
        handleSearchStringChange={handleSearchStringChange}
        handleWaitingListEntryDialogClose={handleWLEntryDialogClose}
        onSubmit={wlEntryFormOnSubmit}
        open={openDupPhoneDialog}
      />
    </>
  );
};
