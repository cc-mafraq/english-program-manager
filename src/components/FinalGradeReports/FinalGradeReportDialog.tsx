import { Box, Dialog, SelectChangeEvent, useTheme } from "@mui/material";
import { nth, pull } from "lodash";
import React, { useCallback, useState } from "react";
import ReactLoading from "react-loading";
import { FGRDialogHeader, FinalGradeReportList } from ".";
import { useColors, useFinalGradeReportStore, useStudentStore } from "../../hooks";
import { getAllSessions, getFGRStudents, StudentAcademicRecordIndex } from "../../services";

interface FinalGradeReportDialogProps {
  handleDialogClose: () => void;
  open: boolean;
}

export const FinalGradeReportDialog: React.FC<FinalGradeReportDialogProps> = ({ handleDialogClose, open }) => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const setShouldDownload = useFinalGradeReportStore((state) => {
    return state.setShouldDownload;
  });

  const { popoverColor } = useColors();
  const scale = 0.5;
  const fgrWidth = 640 * scale;
  const dialogWidth = `${fgrWidth * 3 + 80 * scale + 42}px`;

  const sessionOptions = getAllSessions(students);

  const [fgrSession, setFGRSession] = useState(nth(sessionOptions, 1) || "Sp I 21");
  const [fgrStudents, setFGRStudents] = useState<StudentAcademicRecordIndex[]>(
    getFGRStudents(students, fgrSession),
  );
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const theme = useTheme();

  const handleRemoveFGR = useCallback(
    (studentAcademicRecord: StudentAcademicRecordIndex) => {
      const newFgrStudents = [...pull(fgrStudents, studentAcademicRecord)];
      setFGRStudents(newFgrStudents);
    },
    [fgrStudents],
  );

  const handleDownloadAllClick = useCallback(() => {
    setLoading(true);
    setShouldDownload(true);
  }, [setShouldDownload]);

  const handleDownloadAllComplete = useCallback(() => {
    setLoading(false);
    setShouldDownload(false);
  }, [setShouldDownload]);

  const handleSessionChange = useCallback(
    (event: SelectChangeEvent) => {
      const session = event.target.value as string;
      setFGRSession(session);
      setFGRStudents(getFGRStudents(students, session));
    },
    [students],
  );

  const handleSearchStringChange = useCallback((value: string) => {
    setSearchString(value);
  }, []);

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
          handleSearchStringChange={handleSearchStringChange}
          handleSessionChange={handleSessionChange}
          sessionOptions={sessionOptions}
        />
        {loading && (
          <Box margin="auto" marginTop="1%" width="5%">
            <ReactLoading color={theme.palette.primary.main} type="spin" />
          </Box>
        )}
        <FinalGradeReportList
          fgrStudents={fgrStudents}
          handleDownloadComplete={handleDownloadAllComplete}
          handleRemoveFGR={handleRemoveFGR}
          scale={scale}
          searchString={searchString}
          session={fgrSession}
          width={fgrWidth}
        />
      </Box>
    </Dialog>
  );
};
