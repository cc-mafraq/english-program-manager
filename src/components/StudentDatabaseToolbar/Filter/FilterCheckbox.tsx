import { Checkbox, FormControlLabel } from "@mui/material";
import { cloneDeep, find, isEmpty, remove, toString } from "lodash";
import React, { useContext, useState } from "react";
import { AppContext } from "../../../interfaces";

interface FilterCheckBoxProps {
  path: string;
  value: unknown;
}

export const FilterCheckbox: React.FC<FilterCheckBoxProps> = ({ value, path }) => {
  const {
    appState: { filter },
    appDispatch,
  } = useContext(AppContext);
  const [checked, setChecked] = useState(false);
  const label = typeof value === "boolean" ? (value ? "Yes" : "No") : toString(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    const filterCopy = cloneDeep(filter);
    const prevFieldFilter = find(filterCopy, (fieldFilter) => {
      return fieldFilter.fieldPath === path;
    });
    prevFieldFilter &&
      remove(filterCopy, (filterVal) => {
        return filterVal.fieldPath === prevFieldFilter.fieldPath;
      });
    const fieldFilterValues = prevFieldFilter ? [...prevFieldFilter.values, label] : [label];
    if (event.target.checked) {
      appDispatch({
        payload: {
          filter: [...filterCopy, { fieldPath: path, values: fieldFilterValues }],
        },
      });
    } else if (prevFieldFilter?.values && prevFieldFilter?.values.length > 1) {
      remove(prevFieldFilter?.values, (val) => {
        return val === value;
      });
      appDispatch({
        payload: {
          filter: [...filterCopy, prevFieldFilter],
        },
      });
    } else {
      appDispatch({
        payload: {
          filter: [...filterCopy],
        },
      });
    }
  };

  return value === undefined || isEmpty(toString(value)) ? (
    <></>
  ) : (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleChange} />}
      label={label}
      sx={{ display: "flex", marginTop: -0.5 }}
    />
  );
};
