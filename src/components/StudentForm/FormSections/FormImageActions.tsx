import { HideImage } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { get } from "lodash";
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
      <AddImageButton
        folderName={folderName}
        imagePath={imagePath}
        lightColor="primary"
        student={selectedStudent}
      />
      <Tooltip arrow title="Delete Image">
        <IconButton
          color="primary"
          onClick={async () => {
            if (!selectedStudent) return;
            await deleteImage(selectedStudent, imagePath);
            appDispatch({ payload: { selectedStudent } });
          }}
        >
          <HideImage />
        </IconButton>
      </Tooltip>
    </Box>
  ) : (
    <></>
  );
};
