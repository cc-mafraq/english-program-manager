import { Grid } from "@mui/material";
import React, { useContext } from "react";
import { GridContainer, GridItemTextField, LabeledCheckbox } from "..";
import { Image } from "../..";
import { AppContext } from "../../../interfaces";
import { SPACING, studentImageFolder } from "../../../services";
import { FormImageActions } from "./FormImageActions";

export const FormName: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  return (
    <GridContainer marginBottom={SPACING}>
      <Grid item xs={1}>
        <Image
          folderName={studentImageFolder}
          imagePath="imageName"
          imageStyleProps={{ margin: "auto", maxHeight: "100%", maxWidth: "90px", width: "auto" }}
          innerContainerProps={{
            sx: { transform: "translate(0%, -50%)" },
            top: "50%",
          }}
          lightColor="primary"
          loadingContainerProps={{ marginLeft: "30px", marginTop: 0, transform: "none" }}
          outerContainerProps={{ height: "100%", maxHeight: "100px" }}
          scale={2}
          student={selectedStudent}
        />
      </Grid>
      <FormImageActions folderName={studentImageFolder} imagePath="imageName" />
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
