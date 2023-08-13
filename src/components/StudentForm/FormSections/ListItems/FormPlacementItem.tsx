import { Close } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useColors } from "../../../../hooks";
import { genderedLevels } from "../../../../interfaces";
import { FormItem } from "../../../../services";
import { GridContainer, GridItemAutocomplete, GridItemDatePicker, GridItemTextField } from "../../../reusables";

export const FormPlacementItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();

  return (
    <GridContainer marginBottom={0} marginLeft={0}>
      <GridItemAutocomplete
        autoHighlight={false}
        freeSolo
        label="Level"
        name={name ? `${name}.level` : "level"}
        options={genderedLevels}
        textFieldProps={{ required: true }}
      />
      <GridItemAutocomplete
        autoHighlight={false}
        freeSolo
        label="Section"
        name={name ? `${name}.section` : "section"}
        options={["A", "B", "MW", "CSWL"]}
      />
      <GridItemDatePicker label="Date" name={name ? `${name}.date` : "date"} />
      <GridItemTextField gridProps={{ sm: 5 }} label="Notes" name={name ? `${name}.notes` : "notes"} />
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
