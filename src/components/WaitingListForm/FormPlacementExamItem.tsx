import { Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useColors } from "../../hooks";
import { FormItem } from "../../services";
import { GridItemTextField } from "../reusables";

export const FormPlacementExamItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();

  return (
    <>
      <GridItemTextField gridProps={{ xs: 3 }} label="Placement Exam" name={name} />
      <Tooltip arrow title="Remove Placement Exam">
        <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor, height: "100%" }}>
          <Close />
        </IconButton>
      </Tooltip>
    </>
  );
};
