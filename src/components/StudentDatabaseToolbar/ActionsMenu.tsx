import { Add, Cached, Edit, Upload } from "@mui/icons-material";
import { Box, Grow, Input, InputLabel } from "@mui/material";
import React, { ChangeEvent, useContext, useState } from "react";
import { AppContext } from "../../interfaces";
import { ActionFAB } from "../reusables/Toolbar/ActionFAB";
import { SelectStudentDialog } from "./SelectStudentDialog";

interface ActionsMenuProps {
  handleDialogOpen?: () => void;
  handleGenerateFGRClick?: () => void;
  noEditButton?: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showActions: boolean;
  tooltipObjectName?: string;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  handleGenerateFGRClick,
  handleDialogOpen,
  onInputChange,
  showActions,
  tooltipObjectName,
  noEditButton,
}) => {
  const [openSelectDialog, setOpenSelectDialog] = useState(false);
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const {
    appState: { role },
  } = useContext(AppContext);

  const handleSelectDialogOpen = () => {
    setOpenSelectDialog(true);
  };

  const handleSelectDialogClose = () => {
    setSelectValue(null);
    setOpenSelectDialog(false);
  };

  const tooltipObjectNameSafe = tooltipObjectName ? ` ${tooltipObjectName}` : "";

  return (
    <Grow in={showActions} style={{ transformOrigin: "0 0 0" }}>
      <Box display="flex" flexDirection="column" position="absolute">
        {role === "admin" && handleDialogOpen && (
          <ActionFAB
            fabStyle={{ marginTop: 0.5 }}
            onClick={handleDialogOpen}
            tooltipTitle={`Add${tooltipObjectNameSafe}`}
          >
            <Add />
          </ActionFAB>
        )}
        {role === "admin" && !noEditButton && (
          <ActionFAB onClick={handleSelectDialogOpen} tooltipTitle={`Edit${tooltipObjectNameSafe}`}>
            <Edit />
          </ActionFAB>
        )}
        {role === "admin" && (
          <InputLabel htmlFor="import-spreadsheet">
            <Input
              id="import-spreadsheet"
              inputProps={{ accept: [".txt", ".csv"] }}
              onChange={onInputChange}
              sx={{ display: "none" }}
              type="file"
            />
            <ActionFAB fabProps={{ component: "span" }} tooltipTitle="Import Spreadsheet">
              <Upload />
            </ActionFAB>
          </InputLabel>
        )}
        {(role === "admin" || role === "faculty") && handleGenerateFGRClick && (
          <ActionFAB onClick={handleGenerateFGRClick} tooltipTitle="Generate Final Grade Reports">
            <Cached />
          </ActionFAB>
        )}
        {handleDialogOpen && (
          <SelectStudentDialog
            handleDialogClose={handleSelectDialogClose}
            handleStudentDialogOpen={handleDialogOpen}
            open={openSelectDialog}
            setValue={setSelectValue}
            value={selectValue}
          />
        )}
      </Box>
    </Grow>
  );
};

ActionsMenu.defaultProps = {
  handleDialogOpen: undefined,
  handleGenerateFGRClick: undefined,
  noEditButton: undefined,
  tooltipObjectName: undefined,
};
