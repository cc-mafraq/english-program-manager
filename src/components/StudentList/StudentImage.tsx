import { Box, BoxProps, CardMedia, SxProps } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Student } from "../../interfaces";
import { getStudentImage } from "../../services";
import { AddImageButton } from "./AddImageButton";

interface StudentImageProps {
  imageStyleProps?: SxProps;
  innerContainerProps?: BoxProps;
  outerContainerProps?: BoxProps;
  scale?: number;
  student?: Student;
}

export const StudentImage: React.FC<StudentImageProps> = ({
  imageStyleProps,
  innerContainerProps,
  outerContainerProps,
  scale,
  student,
}) => {
  const [img, setImg] = useState("");

  useEffect(() => {
    const setImage = async () => {
      try {
        if (!student) return;
        const studentImage = await getStudentImage(student);
        setImg(studentImage);
      } catch (e) {
        setImg("");
      }
    };
    setImage();
  }, [student, student?.imageName]);

  return (
    <Box {...outerContainerProps}>
      {student?.imageName ? (
        <CardMedia component="img" image={img} sx={imageStyleProps} />
      ) : (
        <Box sx={{ ...innerContainerProps, position: "relative" }}>
          <Box
            sx={{
              left: "50%",
              margin: 0,
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <AddImageButton scale={scale} student={student} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

StudentImage.defaultProps = {
  imageStyleProps: undefined,
  innerContainerProps: undefined,
  outerContainerProps: undefined,
  scale: 1,
  student: undefined,
};
