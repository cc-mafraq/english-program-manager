import { Box } from "@mui/material";
import JSZip from "jszip";
import { map } from "lodash";
import React from "react";
import { FinalGradeReport } from ".";
import { Student } from "../interfaces";
import { StudentAcademicRecordIndex } from "../services";

interface FinalGradeReportListProps {
  fgrStudents: StudentAcademicRecordIndex[];
  handleDownloadFinished: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  handleRemoveFGR: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  scale: number;
  session: Student["initialSession"];
  shouldDownload: boolean;
  width: number;
  zip: JSZip;
}

export const FinalGradeReportList: React.FC<FinalGradeReportListProps> = ({
  fgrStudents,
  handleDownloadFinished,
  handleRemoveFGR,
  scale,
  session,
  shouldDownload,
  width,
  zip,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {map(fgrStudents, (fgrStudent) => {
        return (
          <span key={`${fgrStudent.student.epId}-${fgrStudent.academicRecordIndex}`}>
            <FinalGradeReport
              handleDownloadFinished={handleDownloadFinished}
              handleRemoveFGR={handleRemoveFGR}
              scale={scale}
              session={session}
              shouldDownload={shouldDownload}
              studentAcademicRecord={fgrStudent}
              width={width}
              zip={zip}
            />
          </span>
        );
      })}
    </Box>
  );
};
