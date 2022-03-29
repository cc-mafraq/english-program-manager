import HideImageIcon from "@mui/icons-material/HideImage";
import { Box, IconButton } from "@mui/material";
import { get, set } from "lodash";
import React, { useContext } from "react";
import { AppContext } from "../../../interfaces";
import { deleteImage } from "../../../services";
import { AddImageButton } from "../../StudentList";

interface FormImageActionsProps {
  folderName: string;
  imagePath: string;
}

export const FormImageActions: React.FC<FormImageActionsProps> = ({ folderName, imagePath }) => {
  const {
    appState: { selectedStudent },
    appDispatch,
  } = useContext(AppContext);

  return get(selectedStudent, imagePath) ? (
    <Box display="flex" flexDirection="column" paddingLeft="5px" paddingTop="20px">
      <AddImageButton folderName={folderName} imagePath={imagePath} student={selectedStudent} />
      <IconButton
        color="primary"
        onClick={() => {
          if (!selectedStudent) return;
          deleteImage(selectedStudent, "imageName");
          set(selectedStudent, imagePath, "");
          appDispatch({ payload: { selectedStudent }, type: "set" });
        }}
      >
        <HideImageIcon />
      </IconButton>
    </Box>
  ) : (
    <></>
  );
};
