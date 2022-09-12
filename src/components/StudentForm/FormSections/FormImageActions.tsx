import { HideImage } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { get } from "lodash";
import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
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
  } = useContext(AppContext);
  const { setValue } = useFormContext();

  return get(selectedStudent, imagePath) ? (
    <Box display="flex" flexDirection="column" paddingLeft="5px" paddingTop="20px">
      <AddImageButton
        folderName={folderName}
        imagePath={imagePath}
        isForm
        lightColor="primary"
        student={selectedStudent}
      />
      <Tooltip arrow title="Delete Image">
        <IconButton
          color="primary"
          onClick={async () => {
            if (!selectedStudent) return;
            await deleteImage(selectedStudent, imagePath, true);
            setValue(imagePath, undefined);
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
