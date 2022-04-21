import { Add, Cached, Edit, Upload } from "@mui/icons-material";
import { Box, Grow, Input, InputLabel } from "@mui/material";
import React, { ChangeEvent } from "react";
import { ActionFAB } from "./ActionFAB";

interface ActionsMenuProps {
  handleGenerateFGRClick: () => void;
  handleStudentDialogOpen: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showActions: boolean;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  handleGenerateFGRClick,
  handleStudentDialogOpen,
  onInputChange,
  showActions,
}) => {
  return (
    <Grow in={showActions} style={{ transformOrigin: "0 0 0" }}>
      <Box display="flex" flexDirection="column" position="absolute">
        <ActionFAB fabStyle={{ marginTop: 0.5 }} onClick={handleStudentDialogOpen} tooltipTitle="Add Student">
          <Add />
        </ActionFAB>
        <ActionFAB onClick={handleStudentDialogOpen} tooltipTitle="Edit Student">
          <Edit />
        </ActionFAB>
        <InputLabel htmlFor="import-spreadsheet">
          <Input
            id="import-spreadsheet"
            inputProps={{ accept: ".txt" }}
            onChange={onInputChange}
            sx={{ display: "none" }}
            type="file"
          />
          <ActionFAB tooltipTitle="Import Spreadsheet">
            <Upload />
          </ActionFAB>
        </InputLabel>
        <ActionFAB onClick={handleGenerateFGRClick} tooltipTitle="Generate Final Grade Reports">
          <Cached />
        </ActionFAB>
      </Box>
    </Grow>
  );
};
