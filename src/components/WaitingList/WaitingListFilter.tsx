import { values } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import { AppContext, HighPriority, WaitlistOutcome, WaitlistStatus } from "../../interfaces";
import { FilterField } from "../../services";
import { FilterDrawer } from "../reusables";

interface WaitingListFilterProps {
  anchorEl?: HTMLButtonElement | null;
  handleClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const booleanCheckboxOptions = ["Yes", "No"];

export const WaitingListFilter: React.FC<WaitingListFilterProps> = ({ anchorEl, handleClose }) => {
  const {
    appState: { students, role },
    appDispatch,
  } = useContext(AppContext);

  const isAdmin = role === "admin";
  const isAdminOrFaculty = isAdmin || role === "faculty";

  const handleClearFilters = useCallback(() => {
    appDispatch({ payload: { waitingListFilter: [] } });
  }, [appDispatch]);

  const filterFields: FilterField[] = useMemo(() => {
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
        name: "Entered in Phone",
        path: "enteredInPhone",
        values: booleanCheckboxOptions,
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
  }, [isAdminOrFaculty]);
  return (
    <FilterDrawer
      anchorEl={anchorEl}
      data={students}
      filterFields={filterFields}
      filterStatePath="waitingListFilter"
      handleClearFilters={handleClearFilters}
      handleClose={handleClose}
    />
  );
};

WaitingListFilter.defaultProps = {
  anchorEl: null,
  handleClose: undefined,
};
