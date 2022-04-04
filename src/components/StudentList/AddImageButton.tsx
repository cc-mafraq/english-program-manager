import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { IconButton, useTheme } from "@mui/material";
import React, { ChangeEvent, useContext } from "react";
import { AppContext, Student } from "../../interfaces";
import { setImage } from "../../services";

interface AddImageButtonProps {
  folderName: string;
  imagePath: string;
  lightColor?: "primary" | "default" | "secondary";
  scale?: number;
  student: Student | null;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({
  scale,
  student,
  imagePath,
  folderName,
  lightColor,
}) => {
  const { appDispatch } = useContext(AppContext);
  const theme = useTheme();

  const inputId = `importImage-${imagePath}-${student?.epId}`;

  return (
    <label htmlFor={inputId}>
      <input
        accept=".png,.jpg,.jpeg,.jfif"
        hidden
        id={inputId}
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          if (!student) return;
          await setImage(student, e.target.files && e.target.files[0], imagePath, folderName);
          appDispatch({ payload: { selectedStudent: student }, type: "set" });
        }}
        type="file"
      />
      <IconButton
        color={theme.palette.mode === "dark" ? "primary" : lightColor || "default"}
        component="span"
        sx={{ transform: `scale(${scale})` }}
      >
        <AddPhotoAlternateIcon />
      </IconButton>
    </label>
  );
};

AddImageButton.defaultProps = {
  lightColor: "default",
  scale: 1,
};
