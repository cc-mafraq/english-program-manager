import { Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useAppStore, useColors } from "../../hooks";
import { FormItem } from "../../services";
import { GridItemTextField } from "../reusables";

export const FormPlacementExamItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();
  const role = useAppStore((state) => {
    return state.role;
  });
  const disabled = role !== "admin";

  return (
    <>
      <GridItemTextField
        gridProps={{ md: 3, sm: 5, xs: 10 }}
        label="Placement Exam"
        name={name}
        textFieldProps={{ disabled }}
      />
      <Tooltip arrow title="Remove Placement Exam">
        <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor, height: "100%" }}>
          <Close />
        </IconButton>
      </Tooltip>
    </>
  );
};
