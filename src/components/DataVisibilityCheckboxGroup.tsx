import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { camelCase, get, map, set } from "lodash";
import React, { useContext } from "react";
import { AppContext } from "../interfaces";

interface DataVisibilityCheckboxGroupProps {
  labels: string[];
  parentLabel: string;
}

export const DataVisibilityCheckboxGroup: React.FC<DataVisibilityCheckboxGroupProps> = ({
  labels,
  parentLabel,
}) => {
  const {
    appState: { dataVisibility },
    appDispatch,
  } = useContext(AppContext);

  const handleChange = (label: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      set(dataVisibility, `${camelCase(parentLabel)}.${camelCase(label)}`, event.target.checked);
      appDispatch({
        payload: { dataVisibility },
        type: "setDataVisibility",
      });
    };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 3 }}>
      {map(labels, (label) => {
        return (
          <FormControlLabel
            key={label}
            control={
              <Checkbox
                checked={get(get(dataVisibility, camelCase(parentLabel)), camelCase(label))}
                onChange={handleChange(label)}
              />
            }
            label={label}
            sx={{ marginTop: -1 }}
          />
        );
      })}
    </Box>
  );
};
