import HideImageIcon from "@mui/icons-material/HideImage";
import { Box, Grid, IconButton } from "@mui/material";
import React, { useContext } from "react";
import { GridContainer, GridItemTextField, LabeledCheckbox } from "..";
import { AddImageButton, Image } from "../..";
import { AppContext } from "../../../interfaces";
import { deleteImage, SPACING, studentImageFolder } from "../../../services";

export const FormName: React.FC = () => {
  const {
    appState: { selectedStudent },
    appDispatch,
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
          outerContainerProps={{ height: "100%", maxHeight: "100px" }}
          scale={2}
          student={selectedStudent}
        />
      </Grid>
      {selectedStudent?.imageName && (
        <Box display="flex" flexDirection="column" paddingLeft="5px" paddingTop="20px">
          <AddImageButton folderName={studentImageFolder} imagePath="imageName" student={selectedStudent} />
          <IconButton
            color="primary"
            onClick={() => {
              deleteImage(selectedStudent, "imageName");
              selectedStudent.imageName = "";
              appDispatch({ payload: { selectedStudent }, type: "set" });
            }}
          >
            <HideImageIcon />
          </IconButton>
        </Box>
      )}
      <GridItemTextField label="Name - ENG" name="name.english" />
      <GridItemTextField label="Name - AR" name="name.arabic" />
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
