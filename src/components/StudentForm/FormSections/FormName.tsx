import { Grid } from "@mui/material";
import React from "react";
import { FormImage, GridContainer, GridItemTextField, LabeledCheckbox } from "..";
import { SPACING, studentImageFolder } from "../../../services";

export const FormName: React.FC = () => {
  return (
    <GridContainer marginBottom={SPACING}>
      <FormImage
        folderName={studentImageFolder}
        imagePath="imageName"
        imageStyleProps={{ margin: "auto", maxHeight: "100%", maxWidth: "90px", width: "auto" }}
        loadingContainerProps={{ marginLeft: "25px", marginTop: 0, transform: "none" }}
        outerContainerProps={{ height: "100%", maxHeight: "100px" }}
        xs={1}
      />
      <GridItemTextField label="Name - ENG" name="name.english" textFieldProps={{ required: true }} />
      <GridItemTextField label="Name - AR" name="name.arabic" textFieldProps={{ required: true }} />
      <Grid item>
        <LabeledCheckbox
          checkboxProps={{ defaultChecked: true }}
          containerProps={{ marginTop: -1 }}
          label="Invite"
          name="status.inviteTag"
        />
        <LabeledCheckbox containerProps={{ marginTop: -1 }} label="NCL" name="status.noContactList" />
      </Grid>
    </GridContainer>
  );
};
