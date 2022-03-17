import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { IconButton } from "@mui/material";
import React, { ChangeEvent, useContext } from "react";
import { AppContext, Student } from "../../interfaces";
import { setStudentImage } from "../../services";

interface AddImageButtonProps {
  scale?: number;
  student?: Student;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({ scale, student }) => {
  const { appDispatch } = useContext(AppContext);

  const inputId = `importImage-${student?.epId}`;

  return (
    <label htmlFor={inputId}>
      <input
        accept=".png,.jpg,.jpeg,.jfif"
        hidden
        id={inputId}
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          if (!student) return;
          student.imageName = await setStudentImage(student, e.target.files && e.target.files[0]);
          appDispatch({ payload: { selectedStudent: student }, type: "setSelectedStudent" });
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
  student: undefined,
};
