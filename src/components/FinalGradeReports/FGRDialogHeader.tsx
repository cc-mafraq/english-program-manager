import { Close, Download } from "@mui/icons-material";
import { Box, Card, IconButton, SelectChangeEvent, Tooltip } from "@mui/material";
import React from "react";
import { SectionPlacement } from "../../interfaces";
import { ClassAndSessionSelect } from "../ClassLists";
import { Searchbar } from "../reusables";

interface FGRDialogHeaderProps {
  fgrSession: string;
  handleClassChange: (event: SelectChangeEvent) => void;
  handleDialogClose: () => void;
  handleDownloadAllClick: () => void;
  handleSearchStringChange: (value: string) => void;
  handleSessionChange: (event: SelectChangeEvent) => void;
  selectedClass?: SectionPlacement;
  sessionOptions: string[];
}

export const FGRDialogHeader: React.FC<FGRDialogHeaderProps> = ({
  fgrSession,
  handleDialogClose,
  handleDownloadAllClick,
  handleSessionChange,
  sessionOptions,
  handleSearchStringChange,
  handleClassChange,
  selectedClass,
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
        <Box marginTop="9px">
          <Searchbar
            handleSearchStringChange={handleSearchStringChange}
            noExpand
            placeholder="Search FGRs"
            width="100%"
          />
        </Box>
        <ClassAndSessionSelect
          classSelectSxProps={{ width: "25%" }}
          handleClassChange={handleClassChange}
          handleSessionChange={handleSessionChange}
          includeAllOption
          noCSWL
          selectedClass={selectedClass}
          selectedSession={fgrSession}
          sessionOptions={sessionOptions}
          sessionSelectSxProps={{ width: "25%" }}
        />
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

FGRDialogHeader.defaultProps = {
  selectedClass: undefined,
};
