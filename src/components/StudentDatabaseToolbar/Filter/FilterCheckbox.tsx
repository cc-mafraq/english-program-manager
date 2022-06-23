import { Checkbox, FormControlLabel } from "@mui/material";
import { cloneDeep, find, includes, isEmpty, remove, toString } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../interfaces";

interface FilterCheckBoxProps {
  label: unknown;
  path: string;
}

interface Mapping {
  [key: string]: unknown;
}

const valueMappings: Mapping = { Female: "F", Male: "M", No: false, Yes: true };

export const FilterCheckbox: React.FC<FilterCheckBoxProps> = ({ label, path }) => {
  const {
    appState: { filter },
    appDispatch,
  } = useContext(AppContext);

  const value = includes(Object.keys(valueMappings), label) ? valueMappings[label as string] : label;
  const [checked, setChecked] = useState(
    includes(
      find(filter, (fieldFilter) => {
        return fieldFilter.fieldPath === path;
      })?.values,
      value,
    ),
  );

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

    const fieldFilterValues = prevFieldFilter ? [...prevFieldFilter.values, value] : [value];
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

  return label === undefined || isEmpty(toString(label)) ? (
    <></>
  ) : (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleChange} />}
      label={label as string}
      sx={{ display: "flex", marginTop: -0.5 }}
    />
  );
};
