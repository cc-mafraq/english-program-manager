import { Box, Dialog, SelectChangeEvent } from "@mui/material";
import download from "downloadjs";
import JSZip from "jszip";
import { cloneDeep, isEqual, nth, pull, replace } from "lodash";
import React, { useContext, useState } from "react";
import { FGRDialogHeader, FinalGradeReportList } from ".";
import { useColors } from "../../hooks";
import { AppContext } from "../../interfaces";
import {
  getAllSessions,
  getFGRStudents,
  getSortedSARIndexArray,
  StudentAcademicRecordIndex,
} from "../../services";

interface FinalGradeReportDialogProps {
  handleDialogClose: () => void;
  open: boolean;
}

export const FinalGradeReportDialog: React.FC<FinalGradeReportDialogProps> = ({ handleDialogClose, open }) => {
  const {
    appState: { students },
  } = useContext(AppContext);

  const { popoverColor } = useColors();
  const scale = 0.5;
  const fgrWidth = 640 * scale;
  const dialogWidth = `${fgrWidth * 3 + 80 * scale + 42}px`;

  const sessionOptions = getAllSessions(students);
  let zippedStudentAcademicRecords: StudentAcademicRecordIndex[] = [];
  let zip = new JSZip();

  const [fgrSession, setFGRSession] = useState(nth(sessionOptions, 1) || "SP I 21");
  const [fgrStudents, setFGRStudents] = useState<StudentAcademicRecordIndex[]>(
    getFGRStudents(students, fgrSession),
  );
  const [shouldDownload, setShouldDownload] = useState(false);

  const handleDownloadAllFinished = async (studentAcademicRecord: StudentAcademicRecordIndex) => {
    zippedStudentAcademicRecords.push(studentAcademicRecord);
    if (isEqual(getSortedSARIndexArray(zippedStudentAcademicRecords), getSortedSARIndexArray(fgrStudents))) {
      setShouldDownload(false);
      const content = await zip.generateAsync({ type: "blob" });
      await download(content, `${replace(fgrSession, /\s/g, "-")}-FGRs`);
      zippedStudentAcademicRecords = [];
      zip = new JSZip();
    }
  };

  const handleRemoveFGR = (studentAcademicRecord: StudentAcademicRecordIndex) => {
    setFGRStudents(cloneDeep(pull(fgrStudents, studentAcademicRecord)));
  };

  const handleDownloadAllClick = () => {
    setShouldDownload(true);
  };

  const handleSessionChange = (event: SelectChangeEvent) => {
    const session = event.target.value as string;
    setFGRSession(session);
    setFGRStudents(getFGRStudents(students, session));
  };

  return (
    <Dialog
      fullScreen
      onClose={handleDialogClose}
      open={open}
      PaperProps={{ style: { backgroundColor: popoverColor, overflowX: "hidden" } }}
      sx={{
        marginLeft: "50%",
        marginTop: "5%",
        transform: "translate(-50%)",
        width: dialogWidth,
      }}
    >
      <Box sx={{ padding: "10px" }}>
        <FGRDialogHeader
          fgrSession={fgrSession}
          handleDialogClose={handleDialogClose}
          handleDownloadAllClick={handleDownloadAllClick}
          handleSessionChange={handleSessionChange}
          sessionOptions={sessionOptions}
        />
        <FinalGradeReportList
          fgrStudents={fgrStudents}
          handleDownloadFinished={handleDownloadAllFinished}
          handleRemoveFGR={handleRemoveFGR}
          scale={scale}
          session={fgrSession}
          shouldDownload={shouldDownload}
          width={fgrWidth}
          zip={zip}
        />
      </Box>
    </Dialog>
  );
};
