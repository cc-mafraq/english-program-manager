import { Box } from "@mui/material";
import download from "downloadjs";
import JSZip from "jszip";
import { filter, includes, isEqual, map, replace } from "lodash";
import React, { useMemo } from "react";
import { FinalGradeReport } from ".";
import { useStudentStore } from "../../hooks";
import { SectionPlacement, Student } from "../../interfaces";
import {
  StudentAcademicRecordIndex,
  getAllSessionsWithRecord,
  getClassName,
  getSortedSARIndexArray,
  searchStudents,
} from "../../services";

interface FinalGradeReportListProps {
  fgrStudents: StudentAcademicRecordIndex[];
  handleDownloadComplete: () => void;
  handleRemoveFGR: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  scale: number;
  searchString: string;
  selectedClass?: SectionPlacement;
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
  selectedClass,
}) => {
  const students = useStudentStore((state) => {
    return state.students;
  });

  const sessionOptions = useMemo(() => {
    return getAllSessionsWithRecord(students);
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
      const sessionString = replace(session, /\s/g, "-");
      const classString = replace(getClassName(selectedClass) ?? "", /\s/g, "-");
      await download(content, selectedClass ? `${classString}_${sessionString}_FGRs` : `${sessionString}-FGRs`);
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

FinalGradeReportList.defaultProps = {
  selectedClass: undefined,
};
