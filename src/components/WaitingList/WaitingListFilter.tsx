import { values } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import { AppContext, HighPriority } from "../../interfaces";
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
        name: "High Priority",
        path: "highPriority",
        values: values(HighPriority),
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
