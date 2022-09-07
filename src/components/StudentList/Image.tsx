import { Box, BoxProps, CardMedia, SxProps, useTheme } from "@mui/material";
import { get } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { AddImageButton } from ".";
import { Student } from "../../interfaces";

interface StudentImageProps {
  folderName: string;
  imagePath: string;
  imageStyleProps?: SxProps;
  innerContainerProps?: BoxProps;
  lightColor?: "primary" | "default" | "secondary";
  loadingContainerProps?: BoxProps & { transform: string };
  noButton?: boolean;
  outerContainerProps?: BoxProps;
  scale?: number;
  student: Student | null;
}

export const Image: React.FC<StudentImageProps> = ({
  imageStyleProps,
  loadingContainerProps,
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
  const [loading, setLoading] = useState(false);
  const imageName = get(student, imagePath);
  const theme = useTheme();

  useEffect(() => {
    imageName && setLoading(true);
    setImg(imageName);
  }, [imageName]);

  const setLoadingState = useCallback((ld: boolean) => {
    setLoading(ld);
  }, []);

  return (
    <Box {...outerContainerProps}>
      {loading && (
        <Box
          sx={{
            marginLeft: "50%",
            marginTop: "50%",
            transform: "translate(-50%, -50%)",
            ...loadingContainerProps,
          }}
        >
          <ReactLoading color={theme.palette.primary.main} type="cylon" />
        </Box>
      )}
      {imageName ? (
        <CardMedia
          component="img"
          image={img}
          onLoad={() => {
            setLoading(false);
          }}
          sx={{ ...imageStyleProps, display: loading ? "none" : undefined }}
        />
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
            {!noButton && !imageName && !loading && (
              <AddImageButton
                folderName={folderName}
                imagePath={imagePath}
                lightColor={lightColor}
                scale={scale}
                setLoading={setLoadingState}
                student={student}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

Image.defaultProps = {
  imageStyleProps: undefined,
  innerContainerProps: undefined,
  lightColor: "default",
  loadingContainerProps: undefined,
  noButton: false,
  outerContainerProps: undefined,
  scale: 1,
};
