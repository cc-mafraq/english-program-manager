import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import { collection } from "firebase/firestore";
import { forEach, isEmpty, omit } from "lodash";
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import {
  ActionsMenu,
  CustomToolbar,
  FinalGradeReportDialog,
  FormDialog,
  Loading,
  StudentForm,
  StudentList,
} from "../components";
import { usePageState, useRole } from "../hooks";
import { AppContext, Status, Student } from "../interfaces";
import {
  app,
  db,
  deleteImage,
  deleteStudentData,
  logout,
  removeNullFromObject,
  searchStudents,
  setPrimaryNumberBooleanArray,
  setStudentData,
  sortStudents,
  spreadsheetToStudentList,
  studentFormSchema,
} from "../services";

export const StudentDatabasePage = () => {
  const {
    appState: { students, selectedStudent, filter, role },
    appDispatch,
  } = useContext(AppContext);
  const studentsRef = useRef(students);
  const [openFGRDialog, setOpenFGRDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [spreadsheetIsLoading, setSpreadsheetIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, authLoading] = useAuthState(auth);
  const [studentDocs, docsLoading, docsError] = useCollection(collection(db, "students"));
  const globalRole = useRole();
  studentsRef.current = students;
  const {
    filteredList: filteredStudents,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchStringChange,
    page,
    rowsPerPage,
    searchString,
    setShowActions,
    setState,
    showActions,
    listPage: studentsPage,
  } = usePageState({ filter, listRef: studentsRef, payloadPath: "students", searchFn: searchStudents });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
    } else if (role !== globalRole) {
      appDispatch({ payload: { role: globalRole } });
    }
  }, [user, authLoading, navigate, role, globalRole, appDispatch]);

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
        newList: sortedStudentData,
      });
    }
  }, [setState, spreadsheetIsLoading, appDispatch, studentDocs]);

  useEffect(() => {
    appDispatch({ payload: { loading: docsLoading } });
  }, [appDispatch, docsLoading]);

  useEffect(() => {
    if (docsError?.code === "permission-denied") {
      logout();
      navigate("/");
    }
  }, [navigate, docsError]);

  useEffect(() => {
    setState({});
  }, [filter, setState]);

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChangePage(null, 0);
      setSpreadsheetIsLoading(true);
      const file: File | null = e.target.files && e.target.files[0];
      const reader = new FileReader();

      file && appDispatch({ payload: { loading: true } });
      file && reader.readAsText(file);

      reader.onloadend = async () => {
        const studentListString = String(reader.result);
        await spreadsheetToStudentList(studentListString, students);
        appDispatch({ payload: { loading: false } });
        setSpreadsheetIsLoading(false);
      };
    },
    [appDispatch, handleChangePage, students],
  );

  const handleStudentDialogOpen = useCallback(() => {
    setOpenStudentDialog(true);
  }, []);

  const handleStudentDialogClose = useCallback(() => {
    setOpenStudentDialog(false);
    appDispatch({ payload: { selectedStudent: null } });
  }, [appDispatch]);

  const handleGenerateFGRClick = useCallback(() => {
    setOpenFGRDialog(true);
  }, []);

  const handleFGRDialogClose = useCallback(() => {
    setOpenFGRDialog(false);
  }, []);

  const studentFormOnSubmit = useCallback(
    (data: Student) => {
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
      if (!data.imageName && selectedStudent?.imageName) {
        deleteImage(selectedStudent, "imageName", true);
      }
      if (!data.covidVaccine.imageName && selectedStudent?.covidVaccine.imageName) {
        deleteImage(selectedStudent, "covidVaccine.imageName", true);
      }
      const dataNoSuspect = data.covidVaccine.suspectedFraud
        ? data
        : omit(data, "covidVaccine.suspectedFraudReason");
      const dataNoNull = removeNullFromObject(dataNoSuspect) as Student;
      setStudentData(dataNoNull);
      dataNoNull.epId !== selectedStudent?.epId && selectedStudent && deleteStudentData(selectedStudent);
      !selectedStudent && handleSearchStringChange(dataNoNull.epId.toString());
      handleStudentDialogClose();
    },
    [handleSearchStringChange, handleStudentDialogClose, selectedStudent],
  );

  return (
    <>
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSearchStringChange={handleSearchStringChange}
          list={searchString || filter.length ? filteredStudents : students}
          page={page}
          rowsPerPage={rowsPerPage}
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
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
        stickySubmit
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
