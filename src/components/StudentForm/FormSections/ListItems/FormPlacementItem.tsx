import { Close } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { GridContainer, GridItemTextField, LabeledCheckbox } from "../..";
import { useColors } from "../../../../hooks";
import { FormItem, SPACING } from "../../../../services";

export const FormPlacementItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();

  return (
    <GridContainer marginBottom={0}>
      <GridItemTextField
        gridProps={{ marginLeft: SPACING, xs: 5 }}
        label="Placement and Date"
        name={name ? `${name}.sectionAndDate` : "sectionAndDate"}
        textFieldProps={{ required: true }}
      />
      <GridItemTextField gridProps={{ xs: 4 }} label="Notes" name={name ? `${name}.notes` : "notes"} />
      <Grid item xs={2}>
        <LabeledCheckbox label="Added to CL" name={name ? `${name}.addedToCL` : "addedToCL"} />
      </Grid>
      {removeItem && (
        <Grid item>
          <Tooltip arrow title="Remove Placement">
            <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor }}>
              <Close />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </GridContainer>
  );
};
