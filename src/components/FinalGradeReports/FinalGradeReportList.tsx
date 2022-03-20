import { Box } from "@mui/material";
import JSZip from "jszip";
import { map } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { FinalGradeReport } from ".";
import { AppContext, Student } from "../../interfaces";
import { getAllSessions, StudentAcademicRecordIndex } from "../../services";

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
  const {
    appState: { students },
  } = useContext(AppContext);
  const [sessionOptions, setSessionOptions] = useState<Student["initialSession"][]>([]);
  useEffect(() => {
    setSessionOptions(getAllSessions(students));
  }, [students]);

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
              sessionOptions={sessionOptions}
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
