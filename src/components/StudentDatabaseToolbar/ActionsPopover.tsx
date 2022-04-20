import CachedIcon from "@mui/icons-material/Cached";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Popover, useTheme } from "@mui/material";
import React, { ChangeEvent } from "react";
import { LabeledIconButton } from "..";
import { useColors } from "../../hooks";

interface ActionsPopoverProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
  handleGenerateFGRClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleImportClick: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ActionsPopover: React.FC<ActionsPopoverProps> = ({
  anchorEl,
  handleClose,
  handleGenerateFGRClick,
  handleImportClick,
}) => {
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const { popoverColor } = useColors();

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={handleClose}
      open={open}
      PaperProps={{ style: { backgroundColor: theme.palette.mode === "light" ? "white" : popoverColor } }}
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
        <label htmlFor="importSpreadsheet">
          <input
            accept=".txt"
            hidden
            id="importSpreadsheet"
            onChange={(e) => {
              handleImportClick(e);
              handleClose();
            }}
            type="file"
          />
          <LabeledIconButton buttonProps={{ component: "span" }} label="IMPORT SPREADSHEET">
            <UploadIcon color="primary" />
          </LabeledIconButton>
        </label>
        <LabeledIconButton
          label="GENERATE FGRs"
          onClick={(e) => {
            handleGenerateFGRClick(e);
            handleClose();
          }}
        >
          <CachedIcon color="primary" />
        </LabeledIconButton>
      </Box>
    </Popover>
  );
};
