import AddIcon from "@mui/icons-material/Add";
import CachedIcon from "@mui/icons-material/Cached";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Popover } from "@mui/material";
import React, { ChangeEvent } from "react";
import { LabeledIconButton } from ".";

interface ActionsPopoverProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleGenerateFGRClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  handleImportClick: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ActionsPopover: React.FC<ActionsPopoverProps> = ({
  anchorEl,
  handleClose,
  handleGenerateFGRClick,
  handleImportClick,
}) => {
  const open = Boolean(anchorEl);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={handleClose}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginRight: "0.5vw",
          maxWidth: "15vw",
        }}
      >
        <LabeledIconButton label="ADD STUDENT">
          <AddIcon color="primary" />
        </LabeledIconButton>
        <label htmlFor="importSpreadsheet">
          <input
            accept=".txt"
            hidden
            id="importSpreadsheet"
            onChange={handleImportClick}
            type="file"
          />
          <LabeledIconButton label="IMPORT SPREADSHEET">
            <UploadIcon color="primary" />
          </LabeledIconButton>
        </label>
        <LabeledIconButton label="GENERATE FGRs" onClick={handleGenerateFGRClick}>
          <CachedIcon color="primary" />
        </LabeledIconButton>
      </Box>
    </Popover>
  );
};
