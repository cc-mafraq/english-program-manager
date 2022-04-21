import { Fab, SxProps, Tooltip } from "@mui/material";
import React from "react";

interface ActionFABProps {
  fabStyle?: SxProps;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  tooltipTitle: string;
}

export const ActionFAB: React.FC<ActionFABProps> = ({ children, tooltipTitle, onClick, fabStyle }) => {
  return (
    <Tooltip arrow placement="right" title={tooltipTitle}>
      <Fab color="primary" onClick={onClick} size="medium" sx={{ marginLeft: 2.5, marginTop: 1.5, ...fabStyle }}>
        {children}
      </Fab>
    </Tooltip>
  );
};

ActionFAB.defaultProps = {
  fabStyle: undefined,
  onClick: undefined,
};
