import { BoxProps, SxProps } from "@mui/material";
import React, { useContext } from "react";
import { Image } from "../..";
import { AppContext } from "../../../interfaces";

interface FormImageProps {
  folderName: string;
  imagePath: string;
  imageStyleProps: SxProps;
  loadingContainerProps: BoxProps & { transform?: string };
  outerContainerProps: BoxProps;
  xs: number | boolean;
}

export const FormImage: React.FC<FormImageProps> = ({
  folderName,
  imagePath,
  imageStyleProps,
  loadingContainerProps,
  outerContainerProps,
  xs,
}) => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  return (
    <Image
      folderName={folderName}
      imagePath={imagePath}
      imageStyleProps={imageStyleProps}
      innerContainerProps={{
        sx: { transform: "translate(0%, -50%)" },
        top: "50%",
      }}
      isForm
      lightColor="primary"
      loadingContainerProps={loadingContainerProps}
      outerContainerProps={outerContainerProps}
      scale={2}
      student={selectedStudent}
      xs={xs}
    />
  );
};
