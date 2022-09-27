import { Checkbox, FormControlLabel } from "@mui/material";
import { cloneDeep, find, get, includes, isEmpty, remove, set, toString } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { AppContext, FilterValue } from "../../../../interfaces";
import { FilterField } from "../../../../services";

interface FilterCheckBoxProps {
  filterField: FilterField;
  filterStatePath: string;
  ignoreValueMappings?: boolean;
  label: unknown;
}

interface Mapping {
  [key: string]: unknown;
}

const valueMappings: Mapping = { Female: "F", Male: "M", No: false, Yes: true };

export const FilterCheckbox = <T,>({
  label,
  filterField,
  filterStatePath,
  ignoreValueMappings,
}: FilterCheckBoxProps) => {
  const { appState, appDispatch } = useContext(AppContext);
  const filter: FilterValue<T>[] = get(appState, filterStatePath);

  const value =
    !ignoreValueMappings && includes(Object.keys(valueMappings), label) ? valueMappings[label as string] : label;
  const [checked, setChecked] = useState(
    includes(
      find(filter, (fieldFilter) => {
        return fieldFilter.fieldPath === filterField.path;
      })?.values,
      value,
    ),
  );

  useEffect(() => {
    if (checked && !filter?.length) {
      setChecked(false);
    }
  }, [checked, filter]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
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
      const payload = set({}, filterStatePath, [
        ...filterCopy,
        { fieldFunction: filterField.fn, fieldPath: filterField.path, values: fieldFilterValues },
      ]);
      appDispatch({ payload });
    } else if (prevFieldFilter?.values && prevFieldFilter?.values.length > 1) {
      remove(prevFieldFilter?.values, (val) => {
        return val === value;
      });
      const payload = set({}, filterStatePath, [...filterCopy, prevFieldFilter]);
      appDispatch({ payload });
    } else {
      const payload = set({}, filterStatePath, [...filterCopy]);
      appDispatch({ payload });
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

FilterCheckbox.defaultProps = {
  ignoreValueMappings: false,
};
