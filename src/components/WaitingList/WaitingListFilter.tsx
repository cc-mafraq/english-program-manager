import { countBy, find, get, values } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import { AppContext, HighPriority, WaitingListEntry, WaitlistOutcome, WaitlistStatus } from "../../interfaces";
import { FilterField } from "../../services";
import { FilterDrawer } from "../reusables";

interface WaitingListFilterProps {
  anchorEl?: HTMLButtonElement | null;
  handleClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tooltipObjectName?: string;
}

const booleanCheckboxOptions = ["Yes", "No"];

export const WaitingListFilter: React.FC<WaitingListFilterProps> = ({
  anchorEl,
  handleClose,
  tooltipObjectName,
}) => {
  const {
    appState: { role, waitingList },
    appDispatch,
  } = useContext(AppContext);
  const waitingListPhoneCounts = useMemo(() => {
    return countBy(waitingList, "primaryPhone");
  }, [waitingList]);

  const isAdmin = role === "admin";
  const isAdminOrFaculty = isAdmin || role === "faculty";

  const handleClearFilters = useCallback(() => {
    appDispatch({ payload: { waitingListFilter: [] } });
  }, [appDispatch]);

  const removeDuplicates = useCallback(
    (wlEntry: WaitingListEntry) => {
      return (
        get(waitingListPhoneCounts, wlEntry.primaryPhone) === 1 ||
        find(waitingList, (wl) => {
          return wl.primaryPhone === wlEntry.primaryPhone;
        })?.id === wlEntry.id
      );
    },
    [waitingList, waitingListPhoneCounts],
  );

  const filterFields: FilterField<WaitingListEntry>[] = useMemo(() => {
    return [
      { condition: isAdminOrFaculty, name: "Waiting", path: "waiting", values: booleanCheckboxOptions },
      {
        condition: isAdminOrFaculty,
        ignoreValueMappings: true,
        name: "High Priority",
        path: "highPriority",
        values: values(HighPriority),
      },
      {
        condition: isAdminOrFaculty,
        fn: removeDuplicates,
        name: "Remove Duplicates",
        path: "phone.primaryPhone",
        values: ["Yes"],
      },
      {
        condition: isAdminOrFaculty,
        name: "Entered in Phone",
        path: "enteredInPhone",
        values: booleanCheckboxOptions,
      },
      {
        condition: isAdminOrFaculty,
        name: "Status",
        path: "status",
        values: values(WaitlistStatus),
      },
      {
        condition: isAdminOrFaculty,
        name: "Outcome",
        path: "outcome",
        values: values(WaitlistOutcome),
      },
      {
        condition: isAdminOrFaculty,
        name: "Probable PL1",
        path: "probPL1",
        values: booleanCheckboxOptions,
      },
      {
        condition: isAdminOrFaculty,
        name: "Probable L3+",
        path: "probL3Plus",
        values: booleanCheckboxOptions,
      },
    ];
  }, [isAdminOrFaculty, removeDuplicates]);
  return (
    <FilterDrawer
      anchorEl={anchorEl}
      data={waitingList}
      filterFields={filterFields}
      filterStatePath="waitingListFilter"
      handleClearFilters={handleClearFilters}
      handleClose={handleClose}
      tooltipObjectName={tooltipObjectName}
    />
  );
};

WaitingListFilter.defaultProps = {
  anchorEl: null,
  handleClose: undefined,
  tooltipObjectName: undefined,
};
