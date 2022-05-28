import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import { collection } from "firebase/firestore";
import { forEach, isEmpty, isUndefined, omit } from "lodash";
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import {
  ActionsMenu,
  FinalGradeReportDialog,
  FormDialog,
  Loading,
  StudentDatabaseToolbar,
  StudentForm,
  StudentList,
} from "../components";
import { AppContext, Status, Student } from "../interfaces";
import {
  app,
  db,
  deleteStudentData,
  getStudentPage,
  logout,
  removeNullFromObject,
  searchStudents,
  setPrimaryNumberBooleanArray,
  setStudentData,
  sortStudents,
  spreadsheetToStudentList,
  studentFormSchema,
} from "../services";

interface SetStateOptions {
  newPage?: number;
  newRowsPerPage?: number;
  newSearchString?: string;
  newStudents?: Student[];
}

export const StudentDatabasePage = () => {
  const {
    appState: { students, selectedStudent },
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

  const studentFormOnSubmit = (data: Student) => {
    const primaryPhone = data.phone.phoneNumbers[data.phone.primaryPhone as number]?.number;
    if (primaryPhone) {
      data.phone.primaryPhone = primaryPhone;
    } else {
      // eslint-disable-next-line no-alert
      alert("You must choose a primary phone number.");
      return;
    }
    if (isEmpty(data.academicRecords) && data.status.currentStatus === Status.NEW) {
      data.academicRecords = [
        {
          level: data.currentLevel,
          session: data.initialSession,
        },
      ];
    }
    const dataNoSuspect = data.covidVaccine.suspectedFraud
      ? data
      : omit(data, "covidVaccine.suspectedFraudReason");
    const dataNoNull = removeNullFromObject(dataNoSuspect) as Student;
    setStudentData(dataNoNull);
    dataNoNull.epId !== selectedStudent?.epId && selectedStudent && deleteStudentData(selectedStudent);
    !selectedStudent && handleSearchStringChange(dataNoNull.epId.toString());
    handleStudentDialogClose();
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
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
          students={searchString ? filteredStudents : students}
        />
        <ActionsMenu
          handleGenerateFGRClick={handleGenerateFGRClick}
          handleStudentDialogOpen={handleStudentDialogOpen}
          onInputChange={onInputChange}
          showActions={showActions}
        />
      </Box>
      {students.length > 0 ? (
        <FinalGradeReportDialog handleDialogClose={handleFGRDialogClose} open={openFGRDialog} />
      ) : (
        <></>
      )}
      <Loading />
      <FormDialog
        dialogProps={{
          fullScreen: true,
          sx: {
            width: "100%",
          },
        }}
        handleDialogClose={handleStudentDialogClose}
        onSubmit={studentFormOnSubmit}
        open={openStudentDialog}
        useFormProps={{
          defaultValues: setPrimaryNumberBooleanArray(selectedStudent),
          resolver: yupResolver(studentFormSchema),
        }}
      >
        <StudentForm />
      </FormDialog>
      <StudentList handleEditStudentClick={handleStudentDialogOpen} studentsPage={studentsPage} />
    </>
  );
};
