import { Add, Cached, Edit, Upload } from "@mui/icons-material";
import { Box, Fab, Grow, Input, InputLabel, Tooltip } from "@mui/material";
import { getAuth } from "firebase/auth";
import { collection } from "firebase/firestore";
import { forEach, isUndefined } from "lodash";
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import {
  FinalGradeReportDialog,
  Loading,
  StudentDatabaseToolbar,
  StudentFormDialog,
  StudentList,
} from "../components";
import { AppContext, Student } from "../interfaces";
import { app, db, getStudentPage, logout, searchStudents, sortStudents } from "../services";
import { spreadsheetToStudentList } from "../services/spreadsheetService";

interface SetStateOptions {
  newPage?: number;
  newRowsPerPage?: number;
  newSearchString?: string;
  newStudents?: Student[];
}

export const StudentDatabasePage = () => {
  const {
    appState: { students },
    appDispatch,
  } = useContext(AppContext);
  const studentsRef = useRef(students);
  const [filteredStudents, setFilteredStudents, filteredStudentsRef] = useState<Student[]>([]);
  const [studentsPage, setStudentsPage] = useState<Student[]>([]);
  const [page, setPage, pageRef] = useState(0);
  const [rowsPerPage, setRowsPerPage, rowsPerPageRef] = useState(10);
  const [openFGRDialog, setOpenFGRDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [searchString, setSearchString, searchStringRef] = useState<string>("");
  const [spreadsheetIsLoading, setSpreadsheetIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, authLoading] = useAuthState(auth);
  const [studentDocs, docsLoading, docsError] = useCollection(collection(db, "students"));

  studentsRef.current = students;

  const setState = useCallback(
    ({ newRowsPerPage, newPage, newSearchString, newStudents }: SetStateOptions) => {
      const newFilteredStudents =
        !isUndefined(newSearchString) || newStudents
          ? searchStudents(
              !isUndefined(newStudents) ? newStudents : studentsRef.current,
              !isUndefined(newSearchString) ? newSearchString : searchStringRef.current,
            )
          : filteredStudentsRef.current;
      setFilteredStudents(newFilteredStudents);
      newStudents && appDispatch({ payload: { students: newStudents }, type: "set" });
      !isUndefined(newPage) && setPage(newPage);
      newRowsPerPage && setRowsPerPage(newRowsPerPage);
      !isUndefined(newSearchString) && setSearchString(newSearchString);
      setStudentsPage(
        getStudentPage(
          newFilteredStudents,
          !isUndefined(newPage) ? newPage : pageRef.current,
          newRowsPerPage || rowsPerPageRef.current,
        ),
      );
    },
    [
      appDispatch,
      filteredStudentsRef,
      pageRef,
      rowsPerPageRef,
      searchStringRef,
      setFilteredStudents,
      setPage,
      setRowsPerPage,
      setSearchString,
    ],
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!spreadsheetIsLoading) {
      const studentData: Student[] = [];
      forEach(studentDocs?.docs, (d) => {
        const data = d.data();
        if (data.name?.english) {
          studentData.push(data as Student);
        }
      });
      const sortedStudentData = sortStudents(studentData);
      setState({
        newStudents: sortedStudentData,
      });
    }
  }, [setState, spreadsheetIsLoading, appDispatch, studentDocs]);

  useEffect(() => {
    appDispatch({ payload: { loading: docsLoading }, type: "set" });
  }, [appDispatch, docsLoading]);

  useEffect(() => {
    if (docsError?.code === "permission-denied") {
      logout();
      navigate("/");
    }
  }, [navigate, docsError]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setState({ newPage });
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setState({ newPage: 0, newRowsPerPage });
  };

  const handleSearchStringChange = (value: string) => {
    setState({ newPage: 0, newSearchString: value });
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangePage(null, 0);
    setSpreadsheetIsLoading(true);
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && appDispatch({ payload: { loading: true }, type: "set" });
    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      await spreadsheetToStudentList(studentListString, students);
      appDispatch({ payload: { loading: false }, type: "set" });
      setSpreadsheetIsLoading(false);
    };
  };

  const handleStudentDialogOpen = () => {
    setOpenStudentDialog(true);
  };

  const handleStudentDialogClose = () => {
    setOpenStudentDialog(false);
    appDispatch({ payload: { selectedStudent: null }, type: "set" });
  };

  const handleGenerateFGRClick = () => {
    setOpenFGRDialog(true);
  };

  const handleFGRDialogClose = () => {
    setOpenFGRDialog(false);
  };

  return (
    <>
      <Box position="sticky" top={0} zIndex={5}>
        <StudentDatabaseToolbar
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSearchStringChange={handleSearchStringChange}
          page={page}
          rowsPerPage={rowsPerPage}
          setShowActions={setShowActions}
          showActions={showActions}
          students={searchString ? filteredStudents : students}
        />
        <Grow in={showActions} style={{ transformOrigin: "0 0 0" }}>
          <Box display="flex" flexDirection="column" position="absolute">
            <Tooltip arrow placement="right" title="Add Student">
              <Fab
                color="primary"
                onClick={handleStudentDialogOpen}
                size="medium"
                sx={{ marginLeft: 2, marginTop: 1 }}
              >
                <Add />
              </Fab>
            </Tooltip>
            <Tooltip arrow placement="right" title="Edit Student">
              <Fab
                color="primary"
                onClick={handleStudentDialogOpen}
                size="medium"
                sx={{ marginLeft: 2, marginTop: 1.5 }}
              >
                <Edit />
              </Fab>
            </Tooltip>
            <InputLabel htmlFor="import-spreadsheet">
              <Input
                id="import-spreadsheet"
                inputProps={{ accept: ".txt" }}
                onChange={onInputChange}
                sx={{ display: "none" }}
                type="file"
              />
              <Tooltip arrow placement="right" title="Import Spreadsheet">
                <Fab color="primary" component="span" size="medium" sx={{ marginLeft: 2, marginTop: 1.5 }}>
                  <Upload />
                </Fab>
              </Tooltip>
            </InputLabel>
            <Tooltip arrow placement="right" title="Generate Final Grade Reports">
              <Fab
                color="primary"
                onClick={handleGenerateFGRClick}
                size="medium"
                sx={{ marginLeft: 2, marginTop: 1.5 }}
              >
                <Cached />
              </Fab>
            </Tooltip>
          </Box>
        </Grow>
      </Box>
      {students.length > 0 ? (
        <FinalGradeReportDialog handleDialogClose={handleFGRDialogClose} open={openFGRDialog} />
      ) : (
        <></>
      )}
      <Loading />
      <StudentFormDialog handleDialogClose={handleStudentDialogClose} open={openStudentDialog} />
      <StudentList handleEditStudentClick={handleStudentDialogOpen} studentsPage={studentsPage} />
    </>
  );
};
