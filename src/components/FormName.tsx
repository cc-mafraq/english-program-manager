import { Grid } from "@mui/material";
import React from "react";
import { GridContainer, GridItemTextField, LabeledCheckbox } from ".";
import { SPACING } from "../services";

export const FormName: React.FC = () => {
  return (
    <GridContainer marginBottom={SPACING}>
      <GridItemTextField label="Name - ENG" name="name.english" />
      <GridItemTextField label="Name - AR" name="name.arabic" />
      <Grid item>
        <LabeledCheckbox
          checkboxProps={{ defaultChecked: true }}
          containerProps={{ marginTop: -1 }}
          label="Invite"
          name="status.inviteTag"
        />
        <LabeledCheckbox
          containerProps={{ marginTop: -1 }}
          label="NCL"
          name="status.noContactList"
        />
      </Grid>
    </GridContainer>
  );
};
