import { Close, Download } from "@mui/icons-material";
import {
  Box,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import { map } from "lodash";
import React from "react";
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
        <Box display="flex" flexDirection="row" marginTop="5px">
          <Tooltip arrow title="Download All">
            <IconButton color="primary" onClick={handleDownloadAllClick} sx={{ height: "45px" }}>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Close Window">
            <IconButton onClick={handleDialogClose} sx={{ height: "45px" }}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Card>
    </>
  );
};
