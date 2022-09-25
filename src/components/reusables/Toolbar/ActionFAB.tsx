import { Fab, FabProps, SxProps, Tooltip } from "@mui/material";
import React from "react";

interface ActionFABProps {
  children?: React.ReactNode;
  fabProps?: FabProps & { component: "span" };
  fabStyle?: SxProps;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  tooltipTitle: string;
}

export const ActionFAB: React.FC<ActionFABProps> = ({ children, tooltipTitle, onClick, fabStyle, fabProps }) => {
  return (
    <Tooltip arrow placement="right" title={tooltipTitle}>
      <Fab
        color="primary"
        onClick={onClick}
        size="medium"
        sx={{ marginLeft: 2.5, marginTop: 1.5, ...fabStyle }}
        {...fabProps}
      >
        {children}
      </Fab>
    </Tooltip>
  );
};

ActionFAB.defaultProps = {
  children: undefined,
  fabProps: undefined,
  fabStyle: undefined,
  onClick: undefined,
};
