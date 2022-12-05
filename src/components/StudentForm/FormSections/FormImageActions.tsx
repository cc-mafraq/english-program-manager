import { HideImage } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useStudentStore } from "../../../hooks";
import { AddImageButton } from "../../StudentList";

interface FormImageActionsProps {
  folderName: string;
  imagePath: string;
  setImg: (image: string | undefined) => void;
  setLoading: (ld: boolean) => void;
}

export const FormImageActions: React.FC<FormImageActionsProps> = ({
  folderName,
  imagePath,
  setImg,
  setLoading,
}) => {
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const { setValue } = useFormContext();

  return (
    <Box display="flex" flexDirection="column" paddingLeft="5px" paddingTop="20px">
      <AddImageButton
        folderName={folderName}
        imagePath={imagePath}
        isForm
        lightColor="primary"
        setImg={setImg}
        setLoading={setLoading}
        student={selectedStudent}
      />
      <Tooltip arrow title="Delete Image">
        <IconButton
          color="primary"
          onClick={() => {
            setValue(imagePath, undefined);
            setImg(undefined);
          }}
        >
          <HideImage />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
