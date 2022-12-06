import { Box } from "@mui/material";
import download from "downloadjs";
import JSZip from "jszip";
import { filter, includes, isEqual, map, replace } from "lodash";
import React, { useMemo } from "react";
import { FinalGradeReport } from ".";
import { useStudentStore } from "../../hooks";
import { Student } from "../../interfaces";
import {
  getAllSessions,
  getSortedSARIndexArray,
  searchStudents,
  StudentAcademicRecordIndex,
} from "../../services";

interface FinalGradeReportListProps {
  fgrStudents: StudentAcademicRecordIndex[];
  handleDownloadComplete: () => void;
  handleRemoveFGR: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  scale: number;
  searchString: string;
  session: Student["initialSession"];
  width: number;
}

export const FinalGradeReportList: React.FC<FinalGradeReportListProps> = ({
  fgrStudents,
  handleDownloadComplete,
  handleRemoveFGR,
  scale,
  searchString,
  session,
  width,
}) => {
  const students = useStudentStore((state) => {
    return state.students;
  });

  const sessionOptions = useMemo(() => {
    return getAllSessions(students);
  }, [students]);
  const filteredStudentsIds = map(searchStudents(map(fgrStudents, "student"), searchString), "epId");
  const filteredFgrStudents = filter(fgrStudents, (aris) => {
    return includes(filteredStudentsIds, aris.student.epId);
  });

  let zippedStudentAcademicRecords: StudentAcademicRecordIndex[] = [];
  let zip = new JSZip();
  const handleDownloadFinished = async (studentAcademicRecord: StudentAcademicRecordIndex) => {
    zippedStudentAcademicRecords.push(studentAcademicRecord);
    if (
      isEqual(getSortedSARIndexArray(zippedStudentAcademicRecords), getSortedSARIndexArray(filteredFgrStudents))
    ) {
      handleDownloadComplete();
      const content = await zip.generateAsync({ type: "blob" });
      await download(content, `${replace(session, /\s/g, "-")}-FGRs`);
      zippedStudentAcademicRecords = [];
      zip = new JSZip();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {map(filteredFgrStudents, (fgrStudent, i) => {
        return (
          <span key={`fgr-${fgrStudent.student.epId}-${fgrStudent.academicRecordIndex}-${i}`}>
            <FinalGradeReport
              handleDownloadFinished={handleDownloadFinished}
              handleRemoveFGR={handleRemoveFGR}
              scale={scale}
              session={session}
              sessionOptions={sessionOptions}
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
