import { Add } from "@mui/icons-material";
import { Box, Grow } from "@mui/material";
import React from "react";
import { useAppStore } from "../../hooks";
import { ActionFAB } from "../reusables/Toolbar/ActionFAB";

interface ActionsMenuProps {
  addButtonTooltip?: string;
  handleDialogOpen?: () => void;
  otherActions?: React.ReactNode;
  showActions: boolean;
  tooltipObjectName?: string;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  handleDialogOpen,
  showActions,
  tooltipObjectName,
  otherActions,
  addButtonTooltip,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });

  const tooltipObjectNameSafe = tooltipObjectName ? ` ${tooltipObjectName}` : "";

  return (
    <Grow in={showActions} style={{ transformOrigin: "0 0 0" }}>
      <Box display="flex" flexDirection="column" position="absolute">
        {role === "admin" && handleDialogOpen && (
          <ActionFAB
            fabStyle={{ marginTop: 0.5 }}
            onClick={handleDialogOpen}
            tooltipTitle={addButtonTooltip || `Add${tooltipObjectNameSafe}`}
          >
            <Add />
          </ActionFAB>
        )}
        {otherActions}
      </Box>
    </Grow>
  );
};

ActionsMenu.defaultProps = {
  addButtonTooltip: undefined,
  handleDialogOpen: undefined,
  otherActions: undefined,
  tooltipObjectName: undefined,
};
