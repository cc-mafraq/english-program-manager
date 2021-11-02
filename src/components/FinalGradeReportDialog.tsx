import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Card, Dialog, TablePagination, Typography } from "@mui/material";
import React, { useState } from "react";
import { FinalGradeReportList, LabeledIconButton } from ".";
import { Student } from "../interfaces";
import { filterBySession, getStudentPage } from "../services";

interface FinalGradeReportDialogProps {
  handleDialogClose: () => void;
  open: boolean;
  students: Student[];
}
const scale = 0.5;
const fgrWidth = 640 * scale;
const fgrSession = "Sp I 21";
const fgrRowsPerPage = 30;

export const FinalGradeReportDialog: React.FC<FinalGradeReportDialogProps> = ({
  handleDialogClose,
  open,
  students,
}) => {
  const fgrStudents = filterBySession(students, fgrSession);
  const [fgrPage, setFGRPage] = useState(0);
  const [fgrStudentsPage, setFGRStudentsPage] = useState<Student[]>(
    getStudentPage(fgrStudents, fgrPage, fgrRowsPerPage),
  );
  const [shouldDownload, setShouldDownload] = useState(false);

  const handleFGRChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setShouldDownload(false);
    setFGRPage(newPage);
    setFGRStudentsPage(getStudentPage(fgrStudents, newPage, fgrRowsPerPage));
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
          <Typography fontWeight="bold" variant="h5">
            Final Grade Reports: {fgrSession}
          </Typography>
          <TablePagination
            component="div"
            count={fgrStudents.length}
            onPageChange={handleFGRChangePage}
            page={fgrPage}
            rowsPerPage={fgrRowsPerPage}
            rowsPerPageOptions={[fgrRowsPerPage]}
          />
          <Box display="flex" flexDirection="row">
            <LabeledIconButton
              label="DOWNLOAD PAGE"
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
          fgrPage={fgrStudentsPage}
          scale={scale}
          session={fgrSession}
          shouldDownload={shouldDownload}
          width={fgrWidth}
        />
      </Box>
    </Dialog>
  );
};
