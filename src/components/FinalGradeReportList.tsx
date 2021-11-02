import { Box } from "@mui/material";
import JSZip from "jszip";
import { map } from "lodash";
import React from "react";
import { FinalGradeReport } from ".";
import { Student } from "../interfaces";

interface FinalGradeReportListProps {
  fgrPage: Student[];
  handleDownloadFinished: (student: Student) => void;
  scale: number;
  session: Student["initialSession"];
  shouldDownload: boolean;
  width: number;
  zip: JSZip;
}

export const FinalGradeReportList: React.FC<FinalGradeReportListProps> = ({
  fgrPage,
  handleDownloadFinished,
  scale,
  session,
  shouldDownload,
  width,
  zip,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {map(fgrPage, (fgrStudent) => {
        return (
          <span key={fgrStudent.epId}>
            <FinalGradeReport
              handleDownloadFinished={handleDownloadFinished}
              scale={scale}
              session={session}
              shouldDownload={shouldDownload}
              student={fgrStudent}
              width={width}
              zip={zip}
            />
          </span>
        );
      })}
    </Box>
  );
};
