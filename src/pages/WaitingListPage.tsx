import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { get, includes, map, nth } from "lodash";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { v4 } from "uuid";
import {
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
import { useAppStore, useFormDialog, usePageState, useWaitingListStore } from "../hooks";
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
  const waitingList = useWaitingListStore((state) => {
    return state.waitingList;
  });
  const setWaitingList = useWaitingListStore((state) => {
    return state.setWaitingList;
  });
  const selectedWaitingListEntry = useWaitingListStore((state) => {
    return state.selectedWaitingListEntry;
  });
  const setSelectedWaitingListEntry = useWaitingListStore((state) => {
    return state.setSelectedWaitingListEntry;
  });
  const filter = useWaitingListStore((state) => {
    return state.filter;
  });
  const role = useAppStore((state) => {
    return state.role;
  });

  const {
    filteredList: filteredWaitingList,
    handleSearchStringChange,
    setShowActions,
    showActions,
  } = usePageState<WaitingListEntry>({
    collectionName: "waitingList",
    filter,
    payloadPath: "waitingList",
    requiredValuePath: "primaryPhone",
    searchFn: searchWaitingList,
    setData: setWaitingList,
    sortFn: sortWaitingList,
  });

  const {
    handleDialogClose: handleWLEntryDialogClose,
    handleDialogOpen: handleWLEntryDialogOpen,
    openDialog: openWLEntryDialog,
  } = useFormDialog({ setSelectedData: setSelectedWaitingListEntry });

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
          addButtonTooltip="Add Waiting List Entry"
          filter={filter}
          filterComponent={<WaitingListFilter />}
          handleDialogOpen={handleWLEntryDialogOpen}
          handleSearchStringChange={handleSearchStringChange}
          list={filteredWaitingList}
          otherActions={
            <WaitingListActions filteredWaitingList={filteredWaitingList} setScrollToIndex={setScrollToIndex} />
          }
          setShowActions={setShowActions}
          showActions={showActions}
          tooltipObjectName="Waiting List"
        />
      </Box>
      <Loading />
      <VirtualizedList
        defaultSize={275}
        deps={[role]}
        idPath="id"
        listData={filteredWaitingList}
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
