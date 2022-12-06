import { AddPhotoAlternate } from "@mui/icons-material";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { get } from "lodash";
import React, { ChangeEvent, useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useColors } from "../../hooks";
import { Student } from "../../interfaces";
import { setImage, uploadImage } from "../../services";

interface AddImageButtonProps {
  folderName: string;
  imagePath: string;
  isForm?: boolean;
  lightColor?: "primary" | "default" | "secondary";
  scale?: number;
  setImg?: (image: string | undefined) => void;
  setLoading?: (ld: boolean) => void;
  student: Student | null;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({
  scale,
  student,
  imagePath,
  folderName,
  lightColor,
  setLoading,
  setImg,
  isForm,
}) => {
  const theme = useTheme();
  const { iconColor } = useColors();
  const methods = useFormContext();

  const inputId = useMemo(() => {
    return uuidv4();
  }, []);

  const onInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setLoading && setLoading(true);
      const file = e.target.files && e.target.files[0];
      const imageURL =
        (await (isForm
          ? uploadImage(student?.epId || methods?.getValues("epId"), file, folderName)
          : student && setImage(student, file, imagePath, folderName))) || undefined;
      methods?.setValue && methods.setValue(imagePath, imageURL);
      setImg && setImg(imageURL);
    },
    [folderName, imagePath, isForm, methods, setImg, setLoading, student],
  );

  return (
    <label htmlFor={inputId}>
      <input accept=".png,.jpg,.jpeg,.jfif" hidden id={inputId} onChange={onInputChange} type="file" />
      <Tooltip arrow title={`${get(student, imagePath) ? "Replace" : "Add"} Image`}>
        <IconButton
          color={lightColor}
          component="span"
          sx={{
            color:
              (lightColor && get(theme.palette, `${lightColor}.main`)) ||
              (theme.palette.mode === "dark" ? iconColor : undefined),
            transform: `scale(${scale})`,
          }}
        >
          <AddPhotoAlternate />
        </IconButton>
      </Tooltip>
    </label>
  );
};

AddImageButton.defaultProps = {
  isForm: false,
  lightColor: "default",
  scale: 1,
  setImg: undefined,
  setLoading: undefined,
};
