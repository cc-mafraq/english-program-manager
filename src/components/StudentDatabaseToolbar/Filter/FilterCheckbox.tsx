import { Checkbox, FormControlLabel } from "@mui/material";
import { cloneDeep, find, includes, isEmpty, remove, toString } from "lodash";
import React, { useContext, useEffect, useState } from "react";
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
  const [checked, setChecked] = useState(
    includes(
      find(filter, (fieldFilter) => {
        return fieldFilter.fieldPath === path;
      })?.values,
      value,
    ),
  );
  const label = typeof value === "boolean" ? (value ? "Yes" : "No") : toString(value);

  useEffect(() => {
    if (checked && !filter.length) {
      setChecked(false);
    }
  }, [checked, filter]);

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
    const newValue =
      value === "Yes" ? true : value === "No" ? false : value === "Male" ? "M" : value === "Female" ? "F" : value;
    const fieldFilterValues = prevFieldFilter ? [...prevFieldFilter.values, newValue] : [newValue];
    if (event.target.checked) {
      appDispatch({
        payload: {
          filter: [...filterCopy, { fieldPath: path, values: fieldFilterValues }],
        },
      });
    } else if (prevFieldFilter?.values && prevFieldFilter?.values.length > 1) {
      remove(prevFieldFilter?.values, (val) => {
        return val === newValue;
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
