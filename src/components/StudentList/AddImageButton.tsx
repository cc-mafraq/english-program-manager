import { IconButton } from "@mui/material";
import React, { ChangeEvent } from "react";
import { Student } from "../../interfaces";
import { setStudentImage } from "../../services";

interface AddImageButtonProps {
  scale?: number;
  student?: Student;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({ children, scale, student }) => {
  const inputId = `importImage-${student?.epId}`;

  return (
    <label htmlFor={inputId}>
      <input
        accept=".png,.jpg,.jpeg,.jfif"
        hidden
        id={inputId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          student && setStudentImage(student, e.target.files && e.target.files[0]);
        }}
        type="file"
      />
      <IconButton color="primary" component="span" sx={{ transform: `scale(${scale})` }}>
        {children}
      </IconButton>
    </label>
  );
};

AddImageButton.defaultProps = {
  scale: 1,
  student: undefined,
};
