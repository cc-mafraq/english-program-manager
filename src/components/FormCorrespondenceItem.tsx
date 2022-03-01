import CloseIcon from "@mui/icons-material/Close";
import { Grid, IconButton } from "@mui/material";
import moment from "moment";
import React from "react";
import { GridItemDatePicker, GridItemTextField } from ".";
import { FormItem, SPACING } from "../services";

export const FormCorrespondenceItem: React.FC<FormItem> = ({ index, removeItem }) => {
  const correspondenceName = `correspondence[${index}]`;
  return (
    <>
      <Grid key={correspondenceName} container>
        <GridItemDatePicker
          gridProps={{ margin: SPACING, xs: 2 }}
          label="Date"
          name={`${correspondenceName}.date`}
          value={moment().format("l")}
        />
        <GridItemTextField
          gridProps={{ marginTop: SPACING }}
          label="Correspondence"
          name={`${correspondenceName}.notes`}
          textFieldProps={{ multiline: true, rows: 4 }}
        />
        <IconButton onClick={removeItem && removeItem(index)} sx={{ height: "30%" }}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </>
  );
};
