import { Box } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { FinalGradeReport } from ".";
import { Student } from "../interfaces";

interface FinalGradeReportListProps {
  fgrPage: Student[];
  scale: number;
  session: Student["initialSession"];
  shouldDownload: boolean;
  width: number;
}

export const FinalGradeReportList: React.FC<FinalGradeReportListProps> = ({
  fgrPage,
  scale,
  session,
  shouldDownload,
  width,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {map(fgrPage, (fgrStudent) => {
        return (
          <span key={fgrStudent.epId}>
            <FinalGradeReport
              scale={scale}
              session={session}
              shouldDownload={shouldDownload}
              student={fgrStudent}
              width={width}
            />
          </span>
        );
      })}
    </Box>
  );
};
