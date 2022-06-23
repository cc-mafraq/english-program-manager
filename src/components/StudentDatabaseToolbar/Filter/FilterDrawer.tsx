import { Box, Button, Drawer, Typography } from "@mui/material";
import { map, sortBy, uniq } from "lodash";
import React, { useContext, useMemo } from "react";
import { FilterCheckbox } from "..";
import { useColors } from "../../../hooks";
import { AppContext, covidStatuses, genderedLevels, nationalities, statuses } from "../../../interfaces";
import { getAllSessions } from "../../../services";

interface FilterDrawerProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface FilterField {
  name: string;
  path: string;
  values?: unknown[];
}

const booleanCheckboxOptions = ["Yes", "No"];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);
  const {
    appState: { students },
    appDispatch,
  } = useContext(AppContext);
  const { popoverColor } = useColors();

  const filterFields: FilterField[] = useMemo(() => {
    return [
      { name: "Invite", path: "status.inviteTag", values: booleanCheckboxOptions },
      { name: "Current Level", path: "currentLevel", values: [...genderedLevels, "L5 GRAD"] },
      { name: "Current Status", path: "status.currentStatus", values: statuses },
      { name: "Initial Session", path: "initialSession", values: getAllSessions(students) },
      { name: "Nationality", path: "nationality", values: nationalities },
      { name: "Gender", path: "gender", values: ["Male", "Female"] },
      { name: "Teacher", path: "work.isTeacher", values: booleanCheckboxOptions },
      { name: "English Teacher", path: "work.isEnglishTeacher", values: booleanCheckboxOptions },
      { name: "Placement Pending", path: "placement.pending", values: booleanCheckboxOptions },
      { name: "COVID Vaccine Status", path: "covidVaccine.status", values: covidStatuses },
    ];
  }, [students]);

  const handleClearFilters = () => {
    appDispatch({ payload: { filter: [] } });
  };

  return (
    <Drawer
      onClose={handleClose}
      open={open}
      PaperProps={{ style: { backgroundColor: popoverColor, maxWidth: 250, paddingRight: 10 } }}
    >
      <Typography fontWeight="bold" marginLeft={1} marginTop={1} variant="h5">
        Filter Students
      </Typography>
      <Button onClick={handleClearFilters}>Clear Filters</Button>
      <Box>
        {map(filterFields, (field, i) => {
          return (
            <Box key={`filter-field-${i}`} margin={1}>
              <Typography fontWeight="bold" marginBottom={0.5} width="100%">
                {field.name}
              </Typography>
              {map(field.values ? field.values : sortBy(uniq(map(students, field.path))), (val) => {
                return <FilterCheckbox key={`filter-field-${field.name}-${val}`} path={field.path} value={val} />;
              })}
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
};
