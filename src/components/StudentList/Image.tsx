import { Box, BoxProps, CardMedia, Grid, SxProps, useTheme } from "@mui/material";
import { get } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactLoading from "react-loading";
import { AddImageButton } from ".";
import { FormImageActions } from "..";
import { Student } from "../../interfaces";

interface ImageProps {
  folderName: string;
  imagePath: string;
  imageStyleProps?: SxProps;
  innerContainerProps?: BoxProps;
  isForm?: boolean;
  lightColor?: "primary" | "default" | "secondary";
  loadingContainerProps?: BoxProps & { transform?: string };
  noButton?: boolean;
  outerContainerProps?: BoxProps;
  scale?: number;
  student: Student | null;
  xs?: number | boolean;
}

export const Image: React.FC<ImageProps> = ({
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
  isForm,
  xs,
}) => {
  const [img, setImg] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const imageName = get(student, imagePath);
  const theme = useTheme();

  useEffect(() => {
    imageName && setLoading(true);
    setImg(imageName);
  }, [imageName]);

  const setImageState = useCallback((image: string | undefined) => {
    setImg(image);
  }, []);

  const setLoadingState = useCallback((ld: boolean) => {
    setLoading(ld);
  }, []);

  const ImageBody = useMemo(() => {
    return (
      <>
        {loading && (
          <Box
            sx={{
              ...loadingContainerProps,
            }}
          >
            <ReactLoading color={theme.palette.primary.main} type="cylon" />
          </Box>
        )}
        {img ? (
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
              {!noButton && !img && !loading && (
                <AddImageButton
                  folderName={folderName}
                  imagePath={imagePath}
                  isForm={isForm}
                  lightColor={lightColor}
                  scale={scale}
                  setImg={setImageState}
                  setLoading={setLoadingState}
                  student={student}
                />
              )}
            </Box>
          </Box>
        )}
      </>
    );
  }, [
    folderName,
    imagePath,
    imageStyleProps,
    img,
    innerContainerProps,
    isForm,
    lightColor,
    loading,
    loadingContainerProps,
    noButton,
    scale,
    setImageState,
    setLoadingState,
    student,
    theme.palette.primary.main,
  ]);

  return isForm ? (
    <>
      <Grid item xs={xs}>
        {ImageBody}
      </Grid>
      {isForm && img && (
        <FormImageActions
          folderName={folderName}
          imagePath={imagePath}
          setImg={setImageState}
          setLoading={setLoadingState}
        />
      )}
    </>
  ) : (
    <Box {...outerContainerProps}>{ImageBody}</Box>
  );
};

Image.defaultProps = {
  imageStyleProps: undefined,
  innerContainerProps: undefined,
  isForm: false,
  lightColor: "default",
  loadingContainerProps: undefined,
  noButton: false,
  outerContainerProps: undefined,
  scale: 1,
  xs: 1,
};
