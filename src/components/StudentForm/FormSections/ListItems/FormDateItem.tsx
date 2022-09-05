import { Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React, { Attributes } from "react";
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
          } as Partial<unknown> & Attributes);
        }
        return child;
      })}
      <Tooltip arrow title="Remove Date">
        <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor, height: "100%" }}>
          <Close />
        </IconButton>
      </Tooltip>
    </>
  );
};
