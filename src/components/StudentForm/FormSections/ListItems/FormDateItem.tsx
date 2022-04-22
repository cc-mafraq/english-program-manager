import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useColors } from "../../../../hooks";
import { FormItem } from "../../../../services";

export const FormDateItem: React.FC<FormItem> = ({ index, removeItem, children, name }) => {
  const { iconColor } = useColors();

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            name,
          });
        }
        return child;
      })}
      <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor, height: "100%" }}>
        <Close />
      </IconButton>
    </>
  );
};
