import { Box, BoxProps, CardMedia, SxProps } from "@mui/material";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { Student } from "../../interfaces";
import { AddImageButton } from "./AddImageButton";

interface StudentImageProps {
  folderName: string;
  imagePath: string;
  imageStyleProps?: SxProps;
  innerContainerProps?: BoxProps;
  lightColor?: "primary" | "default" | "secondary";
  noButton?: boolean;
  outerContainerProps?: BoxProps;
  scale?: number;
  student: Student | null;
}

export const Image: React.FC<StudentImageProps> = ({
  imageStyleProps,
  innerContainerProps,
  outerContainerProps,
  scale,
  student,
  imagePath,
  folderName,
  noButton,
  lightColor,
}) => {
  const [img, setImg] = useState("");
  const imageName = get(student, imagePath);

  useEffect(() => {
    const setImage = async () => {
      try {
        if (!student) return;
        setImg(imageName);
      } catch (e) {
        setImg("");
      }
    };
    setImage();
  }, [student, imagePath, imageName]);

  return (
    <Box {...outerContainerProps}>
      {get(student, imagePath) ? (
        <CardMedia component="img" image={img} sx={imageStyleProps} />
      ) : (
        !noButton && (
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
              <AddImageButton
                folderName={folderName}
                imagePath={imagePath}
                lightColor={lightColor}
                scale={scale}
                student={student}
              />
            </Box>
          </Box>
        )
      )}
    </Box>
  );
};

Image.defaultProps = {
  imageStyleProps: undefined,
  innerContainerProps: undefined,
  lightColor: "default",
  noButton: false,
  outerContainerProps: undefined,
  scale: 1,
};
