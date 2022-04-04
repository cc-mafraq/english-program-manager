import CloseIcon from "@mui/icons-material/Close";
import { Grid, IconButton } from "@mui/material";
import React from "react";
import { GridContainer, GridItemTextField, LabeledCheckbox } from "../..";
import { useColors } from "../../../../hooks";
import { FormItem, SPACING } from "../../../../services";

export const FormPlacementItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();

  return (
    <GridContainer marginBottom={0}>
      <Grid item marginLeft={SPACING}>
        <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor }}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <GridItemTextField
        label="Placement and Date"
        name={`${name}.sectionAndDate`}
        textFieldProps={{ required: true }}
      />
      <GridItemTextField gridProps={{ xs: 4 }} label="Notes" name={`${name}.notes`} />
      <Grid item xs={2}>
        <LabeledCheckbox label="Added to CL" name={`${name}.addedToCL`} />
      </Grid>
    </GridContainer>
  );
};
