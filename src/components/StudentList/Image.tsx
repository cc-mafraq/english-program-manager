/* eslint-disable react/no-unused-prop-types */
import { Box, BoxProps, CardMedia, Grid, GridProps, SxProps, useTheme } from "@mui/material";
import { get, isEmpty, merge, omit } from "lodash";
import React, { useCallback, useState } from "react";
import ReactLoading from "react-loading";
import { AddImageButton } from ".";
import { FormImageActions } from "..";
import { useAppStore } from "../../hooks";
import { Student } from "../../interfaces";

interface ImageProps {
  folderName: string;
  gridProps?: GridProps;
  imagePath: string;
  imageStyleProps?: SxProps;
  innerContainerProps?: BoxProps;
  isForm?: boolean;
  lightColor?: "primary" | "default" | "secondary";
  loadingContainerProps?: BoxProps & { transform?: string };
  loadingIconSize?: string;
  noButton?: boolean;
  outerContainerProps?: BoxProps;
  scale?: number;
  student: Student | null;
}

interface ImageBodyProps extends ImageProps {
  img?: string;
  loading: boolean;
  setImageState: (image: string | undefined) => void;
  setImg: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingState: (loading: boolean) => void;
  student: ImageProps["student"];
}

const ImageBody: React.FC<ImageBodyProps> = ({
  imageStyleProps,
  loadingContainerProps,
  loadingIconSize,
  innerContainerProps,
  scale,
  student,
  imagePath,
  folderName,
  noButton,
  lightColor,
  isForm,
  img,
  loading,
  setImg,
  setLoading,
  setImageState,
  setLoadingState,
}) => {
  const theme = useTheme();
  const role = useAppStore((state) => {
    return state.role;
  });

  return (
    <>
      {loading && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              ...loadingContainerProps,
            }}
          >
            <ReactLoading
              color={theme.palette.primary.main}
              height={loadingIconSize}
              type="cylon"
              width={loadingIconSize}
            />
          </Box>
        </Box>
      )}
      {img ? (
        <CardMedia
          component="img"
          image={img}
          onError={() => {
            setImg(undefined);
            setLoading(false);
          }}
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
            {!noButton && !img && !loading && role === "admin" && (
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
};

export const Image: React.FC<ImageProps> = (props) => {
  const { outerContainerProps, student, imagePath, folderName, isForm, gridProps } = props;
  const imageName = get(student, imagePath);
  const [img, setImg] = useState<string | undefined>(imageName);
  const [loading, setLoading] = useState(!isEmpty(imageName));
  if (!isForm && img !== imageName) setImg(imageName);

  const setImageState = useCallback((image: string | undefined) => {
    setImg(image);
  }, []);

  const setLoadingState = useCallback((ld: boolean) => {
    setLoading(ld);
  }, []);

  const imageBodyProps = { img, loading, setImageState, setImg, setLoading, setLoadingState };

  return isForm ? (
    <>
      <Grid item {...gridProps}>
        <ImageBody {...omit(props, "gridProps")} {...imageBodyProps} />
      </Grid>
      {isForm && img && !loading && (
        <FormImageActions
          folderName={folderName}
          imagePath={imagePath}
          setImg={setImageState}
          setLoading={setLoadingState}
        />
      )}
    </>
  ) : (
    <Box {...outerContainerProps}>
      <ImageBody {...props} {...imageBodyProps} />
    </Box>
  );
};

const defaultProps: Partial<ImageProps> = {
  gridProps: undefined,
  imageStyleProps: undefined,
  innerContainerProps: undefined,
  isForm: false,
  lightColor: "default",
  loadingContainerProps: undefined,
  loadingIconSize: undefined,
  noButton: false,
  outerContainerProps: undefined,
  scale: 1,
};

Image.defaultProps = defaultProps;

ImageBody.defaultProps = merge(defaultProps, {
  img: undefined,
});
