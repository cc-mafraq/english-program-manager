import { Box, Dialog, SelectChangeEvent, useTheme } from "@mui/material";
import { filter, includes } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactLoading from "react-loading";
import { FGRDialogHeader, FinalGradeReportList } from ".";
import { useColors, useFinalGradeReportStore, useStudentStore } from "../../hooks";
import { SectionPlacement } from "../../interfaces";
import {
  StudentAcademicRecordIndex,
  getAllSessionsWithRecord,
  getClassFromClassName,
  getCurrentSession,
  getFGRStudents,
  getSectionPlacement,
} from "../../services";

export const FinalGradeReportDialog: React.FC = () => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const setShouldDownload = useFinalGradeReportStore((state) => {
    return state.setShouldDownload;
  });
  const open = useFinalGradeReportStore((state) => {
    return state.open;
  });
  const setOpen = useFinalGradeReportStore((state) => {
    return state.setOpen;
  });

  const { popoverColor } = useColors();
  const scale = 0.5;
  const fgrWidth = 640 * scale;
  const dialogWidth = `${fgrWidth * 3 + 80 * scale + 42}px`;

  const sessionOptions = useMemo(() => {
    return getAllSessionsWithRecord(students);
  }, [students]);

  const [fgrSession, setFGRSession] = useState("");
  const [selectedClass, setSelectedClass] = useState<SectionPlacement | undefined>(getClassFromClassName(""));
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [hiddenFgrStudents, setHiddenFgrStudents] = useState<StudentAcademicRecordIndex[]>([]);
  const theme = useTheme();
  const currentSession = getCurrentSession(students);
  const fgrOrCurrentSession = fgrSession || currentSession || "";

  const fgrStudents = useMemo(() => {
    return fgrOrCurrentSession ? getFGRStudents(students, fgrOrCurrentSession) : [];
  }, [fgrOrCurrentSession, students]);

  const filteredFgrStudents = filter(fgrStudents, (fgrStudent) => {
    const fgrStudentAcademicRecord = fgrStudent.student.academicRecords[fgrStudent.academicRecordIndex];
    return (
      !includes(hiddenFgrStudents, fgrStudent) &&
      (selectedClass === undefined ||
        getSectionPlacement(fgrStudent.student, fgrOrCurrentSession, selectedClass)?.level ===
          (fgrStudentAcademicRecord?.level ?? fgrStudentAcademicRecord?.levelAudited))
    );
  });

  // Reset hidden students when the dialog opens
  // TODO: I think this isn't working correctly
  useEffect(() => {
    const unsub = useFinalGradeReportStore.subscribe(
      (state) => {
        return state.open;
      },
      (newOpen: boolean) => {
        newOpen && setHiddenFgrStudents([]);
      },
    );
    return () => {
      unsub();
    };
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleRemoveFGR = useCallback(
    (studentAcademicRecord: StudentAcademicRecordIndex) => {
      setHiddenFgrStudents([...hiddenFgrStudents, studentAcademicRecord]);
    },
    [hiddenFgrStudents],
  );

  const handleDownloadAllClick = useCallback(() => {
    setLoading(true);
    setShouldDownload(true);
  }, [setShouldDownload]);

  const handleDownloadAllComplete = useCallback(() => {
    setLoading(false);
    setShouldDownload(false);
  }, [setShouldDownload]);

  const handleSessionChange = useCallback((event: SelectChangeEvent) => {
    const session = event.target.value as string;
    setFGRSession(session);
    setHiddenFgrStudents([]);
  }, []);

  const handleSearchStringChange = useCallback((value: string) => {
    setSearchString(value);
  }, []);

  const handleClassChange = useCallback((event: SelectChangeEvent) => {
    setSelectedClass(getClassFromClassName(event.target.value));
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
      {open && (
        <Box sx={{ padding: "10px" }}>
          <FGRDialogHeader
            fgrSession={fgrOrCurrentSession}
            handleClassChange={handleClassChange}
            handleDialogClose={handleDialogClose}
            handleDownloadAllClick={handleDownloadAllClick}
            handleSearchStringChange={handleSearchStringChange}
            handleSessionChange={handleSessionChange}
            selectedClass={selectedClass}
            sessionOptions={sessionOptions}
          />
          {loading && (
            <Box margin="auto" marginTop="1%" width="5%">
              <ReactLoading color={theme.palette.primary.main} type="spin" />
            </Box>
          )}
          <FinalGradeReportList
            fgrStudents={filteredFgrStudents}
            handleDownloadComplete={handleDownloadAllComplete}
            handleRemoveFGR={handleRemoveFGR}
            scale={scale}
            searchString={searchString}
            session={fgrOrCurrentSession}
            width={fgrWidth}
          />
        </Box>
      )}
    </Dialog>
  );
};
