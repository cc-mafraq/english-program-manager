import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Card,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import download from "downloadjs";
import JSZip from "jszip";
import { cloneDeep, isEqual, map, nth, pull, replace } from "lodash";
import React, { useState } from "react";
import { FinalGradeReportList, LabeledIconButton } from ".";
import { Student } from "../interfaces";
import {
  getAllSessions,
  getFGRStudents,
  getSessionFullName,
  StudentAcademicRecordIndex,
} from "../services";

interface FinalGradeReportDialogProps {
  handleDialogClose: () => void;
  open: boolean;
  students: Student[];
}

export const FinalGradeReportDialog: React.FC<FinalGradeReportDialogProps> = ({
  handleDialogClose,
  open,
  students,
}) => {
  const scale = 0.5;
  const fgrWidth = 640 * scale;
  const sessionOptions = getAllSessions(students);
  let zippedStudentAcademicRecords: StudentAcademicRecordIndex[] = [];
  let zip = new JSZip();

  const [fgrSession, setFGRSession] = useState(nth(sessionOptions, 1) || "Sp I 21");
  const [fgrStudents, setFGRStudents] = useState<StudentAcademicRecordIndex[]>(
    getFGRStudents(students, fgrSession),
  );
  const [shouldDownload, setShouldDownload] = useState(false);

  const handleDownloadAllFinished = async (studentAcademicRecord: StudentAcademicRecordIndex) => {
    zippedStudentAcademicRecords.push(studentAcademicRecord);
    if (
      isEqual(
        map(zippedStudentAcademicRecords, (zsar) => {
          return `${zsar.student.epId}${zsar.academicRecordIndex}`;
        }).sort(),
        map(fgrStudents, (sar) => {
          return `${sar.student.epId}${sar.academicRecordIndex}`;
        }).sort(),
      )
    ) {
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
      PaperProps={{ style: { backgroundColor: "#f5f5f5", overflowX: "hidden" } }}
      sx={{
        marginLeft: "50%",
        marginTop: "5%",
        transform: "translate(-50%)",
        width: `${fgrWidth * 3 + 80 * scale + 42}px`,
      }}
    >
      <Box sx={{ padding: "10px" }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
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
              label="DOWNLOAD ALL"
              onClick={() => {
                setShouldDownload(true);
              }}
            >
              <DownloadIcon />
            </LabeledIconButton>
            <LabeledIconButton color="red" label="CLOSE WINDOW" onClick={handleDialogClose}>
              <CloseIcon color="error" />
            </LabeledIconButton>
          </Box>
        </Card>
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
