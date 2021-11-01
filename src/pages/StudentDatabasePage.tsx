import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Card, Dialog, Typography } from "@mui/material";
import { includes, map } from "lodash";
import React, { ChangeEvent, useState } from "react";
import {
  FinalGradeReport,
  LabeledIconButton,
  StudentDatabaseToolbar,
  StudentList,
} from "../components";
import { Student } from "../interfaces";
import { getStudentPage } from "../services";
import { spreadsheetToStudentList } from "../services/spreadsheetService";

const scale = 0.5;
const fgrWidth = 640 * scale;

export const StudentDatabasePage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsPage, setStudentsPage] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [openFGRModal, setOpenFGRModal] = useState(false);
  const fgrSession = "Sp I 21";

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    setStudentsPage(getStudentPage(students, newPage, rowsPerPage));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setStudentsPage(getStudentPage(students, 0, newRowsPerPage));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const studentList = spreadsheetToStudentList(studentListString);
      setStudents(studentList);
      setStudentsPage(getStudentPage(studentList, page, rowsPerPage));
    };
  };

  const handleGenerateFGRClick = () => {
    setOpenFGRModal(true);
  };

  const handleFGRModalClose = () => {
    setOpenFGRModal(false);
  };

  return (
    <>
      <StudentDatabaseToolbar
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleGenerateFGRClick={handleGenerateFGRClick}
        handleImportClick={onInputChange}
        page={page}
        rowsPerPage={rowsPerPage}
        students={students}
      />
      {students.length > 0 ? (
        <Dialog
          fullScreen
          onClose={handleFGRModalClose}
          open={openFGRModal}
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
              <Typography fontWeight="bold" variant="h5">
                Final Grade Reports: {fgrSession}
              </Typography>
              <Box display="flex" flexDirection="row">
                <LabeledIconButton label="DOWNLOAD ALL">
                  <DownloadIcon />
                </LabeledIconButton>
                <LabeledIconButton color="red" label="CLOSE WINDOW" onClick={handleFGRModalClose}>
                  <CloseIcon color="error" />
                </LabeledIconButton>
              </Box>
            </Card>
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
              {map(students, (fgrStudent) => {
                return includes(map(fgrStudent.academicRecords, "session"), fgrSession) ? (
                  <FinalGradeReport
                    scale={scale}
                    session={fgrSession}
                    student={fgrStudent}
                    width={fgrWidth}
                  />
                ) : (
                  <></>
                );
              })}
            </Box>
          </Box>
        </Dialog>
      ) : (
        <></>
      )}
      <StudentList studentsPage={studentsPage} />
    </>
  );
};
