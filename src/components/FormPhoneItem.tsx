import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, IconButton, useTheme } from "@mui/material";
import React from "react";
import { GridItemTextField, LabeledCheckbox } from ".";
import { FormItem, SPACING } from "../services";

export const FormPhoneItem: React.FC<FormItem> = ({ index, removeItem }) => {
  const phoneName = `phone.phoneNumbers[${index}]`;
  const theme = useTheme();
  return (
    <Grid key={phoneName} item padding={SPACING} xs>
      <Grid container>
        <GridItemTextField
          label={`Phone Number ${Number(index) + 1}`}
          name={`${phoneName}.number`}
        />
        <Box
          sx={{
            border: 1,
            borderColor: theme.palette.grey[400],
            borderRadius: 1,
            marginLeft: 0.5,
          }}
        >
          <IconButton onClick={removeItem && removeItem(index)} sx={{ height: "100%" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Grid>
      <GridItemTextField
        gridProps={{ marginTop: SPACING / 2 }}
        label={`Phone Notes ${Number(index) + 1}`}
        name={`${phoneName}.notes`}
      />
      <LabeledCheckbox
        containerProps={{ marginTop: 0 }}
        errorName="phone.primaryPhone"
        label="Primary"
        name={`phone.primaryPhone[${index}]`}
      />
    </Grid>
  );
};
