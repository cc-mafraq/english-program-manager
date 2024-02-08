import { countBy, filter, find, first, get, last, map, orderBy, take, uniq, values } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { useAppStore, useWaitingListStore } from "../../hooks";
import { HighPriority, WaitingListEntry, WaitlistOutcome } from "../../interfaces";
import { FilterField, MOMENT_FORMAT } from "../../services";
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
  const role = useAppStore((state) => {
    return state.role;
  });
  const waitingList = useWaitingListStore((state) => {
    return state.waitingList;
  });
  const waitingListFilter = useWaitingListStore((state) => {
    return state.filter;
  });
  const setFilter = useWaitingListStore((state) => {
    return state.setFilter;
  });
  const waitingListPhoneCounts = useMemo(() => {
    return countBy(waitingList, "primaryPhone");
  }, [waitingList]);

  const isAdmin = role === "admin";
  const isAdminOrFaculty = isAdmin || role === "faculty";

  const handleClearFilters = useCallback(() => {
    setFilter([]);
  }, [setFilter]);

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

  const outcomeFn = useCallback((wlEntry: WaitingListEntry) => {
    return wlEntry.outcome ? wlEntry.outcome : "None";
  }, []);

  const placementExamFn = useCallback((wlEntry: WaitingListEntry) => {
    const value = last(wlEntry.placementExam);
    const upperVal = value?.toUpperCase();
    const placementVals = ["RESCHED", "NO RESPONSE", "NS", "NO SHOW"];
    const dateMatch = upperVal?.match(/\d+\W\d+\W\d+/);
    if (dateMatch) {
      return moment(first(dateMatch)).format(MOMENT_FORMAT);
    }
    const valueMatches = filter(placementVals, (placementVal) => {
      return !!upperVal?.includes(placementVal);
    });
    const valueMatch = first(valueMatches);
    return valueMatches.length ? (valueMatch === "NS" ? "NO SHOW" : valueMatch) : "NONE";
  }, []);

  const eligibleFn = useCallback((wlEntry: WaitingListEntry) => {
    return wlEntry.eligible === undefined ? false : wlEntry.eligible;
  }, []);

  const placementExamValues = useMemo(() => {
    return take(
      uniq(
        orderBy(
          map(waitingList, placementExamFn),
          (value) => {
            return moment(value).format("YYYYMMDD");
          },
          ["desc"],
        ),
      ),
      15,
    );
  }, [placementExamFn, waitingList]);

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
        fn: eligibleFn,
        name: "Eligible",
        path: "eligible",
        values: booleanCheckboxOptions,
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
        name: "Gender",
        path: "gender",
        values: ["Male", "Female", "Mixed"],
      },
      {
        condition: isAdminOrFaculty,
        fn: placementExamFn,
        name: "Placement Exam",
        path: "placementExam",
        values: placementExamValues,
      },
      {
        condition: isAdminOrFaculty,
        fn: outcomeFn,
        name: "Outcome",
        path: "outcome",
        values: ["None", ...values(WaitlistOutcome)],
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
  }, [eligibleFn, isAdminOrFaculty, outcomeFn, placementExamFn, placementExamValues, removeDuplicates]);

  return (
    <FilterDrawer
      anchorEl={anchorEl}
      data={waitingList}
      filter={waitingListFilter}
      filterFields={filterFields}
      handleClearFilters={handleClearFilters}
      handleClose={handleClose}
      setFilter={setFilter}
      tooltipObjectName={tooltipObjectName}
    />
  );
};

WaitingListFilter.defaultProps = {
  anchorEl: null,
  handleClose: undefined,
  tooltipObjectName: undefined,
};
