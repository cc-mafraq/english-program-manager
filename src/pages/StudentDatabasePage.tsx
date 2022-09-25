import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { collection } from "firebase/firestore";
import { forEach, isEmpty, omit } from "lodash";
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import {
  AcademicRecords,
  ActionsMenu,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
  FinalGradeReportDialog,
  FormDialog,
  Loading,
  PlacementList,
  StudentCardHeader,
  StudentFilter,
  StudentForm,
  StudentInfo,
  VirtualizedList,
} from "../components";
import { StudentCardImage } from "../components/StudentList/StudentCardImage";
import { usePageState } from "../hooks";
import { AppContext, emptyStudent, Status, Student } from "../interfaces";
import {
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
    appState: { students, selectedStudent, studentFilter: filter, role },
    appDispatch,
  } = useContext(AppContext);
  const studentsRef = useRef(students);
  const [openFGRDialog, setOpenFGRDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [spreadsheetIsLoading, setSpreadsheetIsLoading] = useState(false);
  const navigate = useNavigate();
  const [studentDocs, docsLoading, docsError] = useCollection(collection(db, "students"));
  const isAdminOrFaculty = role === "admin" || role === "faculty";
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
          filterComponent={<StudentFilter />}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSearchStringChange={handleSearchStringChange}
          list={searchString || filter.length ? filteredStudents : students}
          page={page}
          rowsPerPage={rowsPerPage}
          searchPlaceholder="Search students"
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
      <VirtualizedList defaultSize={600} deps={[role]} idPath="epId" page={studentsPage}>
        <CustomCard
          data={emptyStudent}
          header={<StudentCardHeader data={emptyStudent} handleEditStudentClick={handleStudentDialogOpen} />}
          image={<StudentCardImage data={emptyStudent} />}
          noTabs={role !== "admin" && role !== "faculty"}
          tabContents={[
            { component: StudentInfo, label: "Student Information" },
            { component: CorrespondenceList, hidden: role !== "admin", label: "Correspondence" },
            {
              component: AcademicRecords,
              hidden: !isAdminOrFaculty,
              label: "Academic Records",
            },
            { component: PlacementList, hidden: !isAdminOrFaculty, label: "Placement" },
          ]}
        />
      </VirtualizedList>
    </>
  );
};
