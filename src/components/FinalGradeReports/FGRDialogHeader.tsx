import { Close, Download } from "@mui/icons-material";
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { map } from "lodash";
import React from "react";
import { LabeledIconButton } from "..";
import { getSessionFullName } from "../../services";

interface FGRDialogHeaderProps {
  fgrSession: string;
  handleDialogClose: () => void;
  handleDownloadAllClick: () => void;
  handleSessionChange: (event: SelectChangeEvent) => void;
  sessionOptions: string[];
}

export const FGRDialogHeader: React.FC<FGRDialogHeaderProps> = ({
  fgrSession,
  handleDialogClose,
  handleDownloadAllClick,
  handleSessionChange,
  sessionOptions,
}) => {
  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "5px",
          padding: "5px",
        }}
      >
        <Box sx={{ marginBottom: "auto", marginLeft: "5%", marginTop: "auto" }}>
          <Typography fontWeight="bold" variant="h5">
            Final Grade Reports
          </Typography>
        </Box>
        <Box sx={{ width: "30%" }}>
          <FormControl fullWidth>
            <InputLabel id="session-label">Session</InputLabel>
            <Select
              id="session-select"
              label="Session"
              labelId="session-label"
              onChange={handleSessionChange}
              value={fgrSession}
            >
              {map(sessionOptions, (so) => {
                return (
                  <MenuItem key={so} value={so}>
                    {getSessionFullName(so)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="row">
          <LabeledIconButton
            buttonProps={{ color: "primary" }}
            label="DOWNLOAD ALL"
            onClick={handleDownloadAllClick}
          >
            <Download />
          </LabeledIconButton>
          <LabeledIconButton color="red" label="CLOSE WINDOW" onClick={handleDialogClose}>
            <Close color="error" />
          </LabeledIconButton>
        </Box>
      </Card>
    </>
  );
};
