import { Box, Button, Drawer, Typography, useTheme } from "@mui/material";
import { find, includes, map, sortBy, uniq } from "lodash";
import React from "react";
import { FilterCheckbox } from ".";
import { useColors } from "../../../../hooks";
import { FilterValue } from "../../../../interfaces";
import { FilterField } from "../../../../services";

interface Mapping {
  [key: string]: unknown;
}

const valueMappings: Mapping = { Female: "F", Male: "M", No: false, Yes: true };

interface FilterDrawerProps<T> {
  anchorEl?: HTMLButtonElement | null;
  data: T[];
  filter: FilterValue<T>[];
  filterFields: FilterField<T>[];
  handleClearFilters: () => void;
  handleClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setFilter: (filter: FilterValue<T>[]) => void;
  tooltipObjectName?: string;
}

export const FilterDrawer = <T,>({
  data,
  filter,
  filterFields,
  anchorEl,
  handleClose,
  handleClearFilters,
  tooltipObjectName,
  setFilter,
}: FilterDrawerProps<T>) => {
  const open = Boolean(anchorEl);
  const { popoverColor } = useColors();
  const theme = useTheme();

  return (
    <Drawer
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          backgroundColor: popoverColor,
          paddingLeft: "20px",
          paddingRight: 10,
          width: "235px",
        },
      }}
    >
      <Typography fontWeight="bold" marginLeft={1} marginTop={1} variant="h5">
        Filter {tooltipObjectName}
      </Typography>
      <Button
        color={theme.palette.mode === "light" ? "secondary" : undefined}
        onClick={handleClearFilters}
        sx={{
          borderRadius: 8,
          marginBottom: -3,
          marginLeft: theme.palette.mode === "light" ? "3%" : 0.5,
          marginTop: 1,
          width: theme.palette.mode === "light" ? "75%" : "60%",
        }}
        variant={theme.palette.mode === "light" ? "contained" : undefined}
      >
        Clear Filters
      </Button>
      <Box>
        {map(filterFields, (field, i) => {
          return (
            <Box
              key={`filter-field-${i}`}
              hidden={field.condition !== undefined && !field.condition}
              margin={1}
              marginTop={5}
            >
              <Typography fontSize={18} fontWeight="bold" marginBottom={0.5} width="100%">
                {field.name}
              </Typography>
              {map(field.values ? field.values : sortBy(uniq(map(data, field.path))), (val) => {
                const value =
                  !field.ignoreValueMappings && includes(Object.keys(valueMappings), val)
                    ? valueMappings[val as string]
                    : val;
                const checked = includes(
                  find(filter, (fieldFilter) => {
                    return fieldFilter.fieldPath === field.path;
                  })?.values,
                  value,
                );
                return (
                  <FilterCheckbox
                    key={`filter-field-${field.name}-${val}`}
                    checked={checked}
                    filter={filter}
                    filterField={field}
                    label={val}
                    setFilter={setFilter}
                    value={value}
                  />
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
};

FilterDrawer.defaultProps = {
  anchorEl: null,
  handleClose: undefined,
  tooltipObjectName: undefined,
};
