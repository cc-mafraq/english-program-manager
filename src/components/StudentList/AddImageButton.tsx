import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { IconButton } from "@mui/material";
import { set } from "lodash";
import React, { ChangeEvent, useContext } from "react";
import { AppContext, Student } from "../../interfaces";
import { setImage } from "../../services";

interface AddImageButtonProps {
  folderName: string;
  imagePath: string;
  scale?: number;
  student: Student | null;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({ scale, student, imagePath, folderName }) => {
  const { appDispatch } = useContext(AppContext);

  const inputId = `importImage-${imagePath}-${student?.epId}`;

  return (
    <label htmlFor={inputId}>
      <input
        accept=".png,.jpg,.jpeg,.jfif"
        hidden
        id={inputId}
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          if (!student) return;
          set(
            student,
            imagePath,
            await setImage(student, e.target.files && e.target.files[0], imagePath, folderName),
          );
          appDispatch({ payload: { selectedStudent: student }, type: "set" });
        }}
        type="file"
      />
      <IconButton color="primary" component="span" sx={{ transform: `scale(${scale})` }}>
        <AddPhotoAlternateIcon />
      </IconButton>
    </label>
  );
};

AddImageButton.defaultProps = {
  scale: 1,
};
