import { Close } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useColors } from "../../../../hooks";
import { FormItem, SPACING } from "../../../../services";
import { GridItemTextField, LabeledCheckbox } from "../../../reusables";

export const FormPhoneItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();

  return (
    <>
      <Grid item padding={SPACING} xs={3}>
        <GridItemTextField
          label={`Phone Number ${Number(index) + 1}`}
          name={`${name}.number`}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField
          gridProps={{ marginTop: SPACING / 2 }}
          label={`Phone Notes ${Number(index) + 1}`}
          name={`${name}.notes`}
        />
        <LabeledCheckbox errorName="phone.primaryPhone" label="Primary" name={`phone.primaryPhone[${index}]`} />
      </Grid>
      <Tooltip arrow title="Remove Phone Number">
        <IconButton
          onClick={removeItem && removeItem(index)}
          sx={{ color: iconColor, height: "15%", marginLeft: -1, marginTop: SPACING }}
        >
          <Close />
        </IconButton>
      </Tooltip>
    </>
  );
};
