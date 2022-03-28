import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { camelCase, every, forOwn, get, set, some, values } from "lodash";
import React, { useContext } from "react";
import { AppContext } from "../../interfaces";

interface IndeterminateCheckboxProps {
  label: string;
}

export const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = ({ children, label }) => {
  const {
    appState: { dataVisibility },
    appDispatch,
  } = useContext(AppContext);
  const childrenValues = get(dataVisibility, camelCase(label));
  const allValuesChecked = every(values(childrenValues));
  const noValuesChecked = !some(values(childrenValues));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    forOwn(childrenValues, (v, k: string) => {
      set(childrenValues, k, event.target.checked);
    });
    set(dataVisibility, camelCase(label), childrenValues);
    appDispatch({
      payload: { dataVisibility },
      type: "set",
    });
  };

  return (
    <Accordion elevation={0}>
      <AccordionSummary
        expandIcon={
          <IconButton>
            <ExpandMoreIcon />
          </IconButton>
        }
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={allValuesChecked}
              indeterminate={!allValuesChecked && !noValuesChecked}
              onChange={handleChange}
            />
          }
          label={<Typography fontWeight="bold">{label}</Typography>}
          onClick={(event) => {
            return event.stopPropagation();
          }}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ height: "100%", marginTop: -1.5 }}>{children}</AccordionDetails>
    </Accordion>
  );
};
