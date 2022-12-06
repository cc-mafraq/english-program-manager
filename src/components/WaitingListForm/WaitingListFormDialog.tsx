import { yupResolver } from "@hookform/resolvers/yup";
import { get, includes, map, nth } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { v4 } from "uuid";
import { useFormDialog, useWaitingListFormStore, useWaitingListStore } from "../../hooks";
import { emptyWaitingListEntry, WaitingListEntry } from "../../interfaces";
import {
  removeNullFromObject,
  setData,
  setPrimaryNumberBooleanArray,
  waitingListFormSchema,
} from "../../services";
import { FormDialog } from "../reusables";
import { WaitingListDupPhoneDialog } from "./WaitingListDupPhoneDialog";
import { WaitingListForm } from "./WaitingListForm";

interface WaitingListFormDialogProps {
  handleSearchStringChange: (value: string) => void;
}

export const WaitingListFormDialog: React.FC<WaitingListFormDialogProps> = ({ handleSearchStringChange }) => {
  const waitingList = useWaitingListStore((state) => {
    return state.waitingList;
  });
  const selectedWaitingListEntry = useWaitingListStore((state) => {
    return state.selectedWaitingListEntry;
  });
  const setSelectedWaitingListEntry = useWaitingListStore((state) => {
    return state.setSelectedWaitingListEntry;
  });
  const open = useWaitingListFormStore((state) => {
    return state.open;
  });
  const setWaitingListFormDialogOpen = useWaitingListFormStore((state) => {
    return state.setOpen;
  });

  const [submitData, setSubmitData] = useState(emptyWaitingListEntry);
  const {
    handleDialogClose: handleDupPhoneDialogClose,
    handleDialogOpen: handleDupPhoneDialogOpen,
    openDialog: openDupPhoneDialog,
  } = useFormDialog({});

  const handleWLEntryDialogClose = useCallback(() => {
    setWaitingListFormDialogOpen(false);
    setSelectedWaitingListEntry(null);
  }, [setSelectedWaitingListEntry, setWaitingListFormDialogOpen]);

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

  const dialogProps = useMemo(() => {
    return {
      fullScreen: true,
      sx: {
        width: "100%",
      },
    };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: setPrimaryNumberBooleanArray(selectedWaitingListEntry, "phoneNumbers"),
      resolver: yupResolver(waitingListFormSchema),
    };
  }, [selectedWaitingListEntry]);

  return (
    <>
      <FormDialog<WaitingListEntry>
        dialogProps={dialogProps}
        handleDialogClose={handleWLEntryDialogClose}
        onSubmit={checkDuplicatePhone}
        open={open}
        stickySubmit
        useFormProps={useFormProps}
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
