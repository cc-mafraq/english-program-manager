import { Checkbox, FormControlLabel } from "@mui/material";
import { cloneDeep, find, get, isEmpty, remove, toString } from "lodash";
import React from "react";
import { FilterValue } from "../../../../interfaces";
import { FilterField } from "../../../../services";

interface FilterCheckBoxProps<T> {
  checked: boolean;
  filter: FilterValue<T>[];
  filterField: FilterField<T>;
  label: unknown;
  setFilter: (filter: FilterValue<T>[]) => void;
  value: string | boolean;
}

export const FilterCheckbox = <T,>({
  checked,
  label,
  filterField,
  filter,
  setFilter,
  value,
}: FilterCheckBoxProps<T>) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterCopy = cloneDeep(filter);
    const prevFieldFilter = find(filterCopy, (fieldFilter) => {
      return fieldFilter.fieldPath === filterField.path;
    });
    prevFieldFilter &&
      remove(filterCopy, (filterVal) => {
        return get(filterVal, "fieldPath") === prevFieldFilter.fieldPath;
      });

    const fieldFilterValues = prevFieldFilter ? [...prevFieldFilter.values, value] : [value];
    if (event.target.checked) {
      setFilter([
        ...filterCopy,
        { fieldFunction: filterField.fn, fieldPath: filterField.path, values: fieldFilterValues },
      ]);
    } else if (prevFieldFilter?.values && prevFieldFilter?.values.length > 1) {
      remove(prevFieldFilter?.values, (val) => {
        return val === value;
      });
      setFilter([...filterCopy, prevFieldFilter]);
    } else {
      setFilter([...filterCopy]);
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
