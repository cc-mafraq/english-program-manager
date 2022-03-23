import { FirebaseError } from "firebase/app";
import { collection, DocumentData, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { forEach, isUndefined } from "lodash";
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef } from "react";
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
import { db, getStudentPage, logout, searchStudents, sortStudents } from "../services";
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
  const navigate = useNavigate();

  studentsRef.current = students;

  const setState = useCallback(
    ({ newRowsPerPage, newPage, newSearchString, newStudents }: SetStateOptions) => {
      appDispatch({ payload: { loading: true }, type: "set" });
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
      appDispatch({ payload: { loading: false }, type: "set" });
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

  const nextSnapshot = useCallback(
    (snapshot: QuerySnapshot<DocumentData>) => {
      const studentData: Student[] = [];
      forEach(snapshot.docs, (d) => {
        const data = d.data();
        if (data.name?.english) {
          studentData.push(data as Student);
        }
      });
      const sortedStudentData = sortStudents(studentData);
      setState({
        newStudents: sortedStudentData,
      });
    },
    [setState],
  );

  const errorSnapshot = useCallback(
    (e: FirebaseError) => {
      if (e.code === "permission-denied") {
        logout();
        navigate("/");
      }
    },
    [navigate],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), nextSnapshot, errorSnapshot);
    return () => {
      unsubscribe();
    };
  }, [errorSnapshot, nextSnapshot]);

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
    appDispatch({ payload: { loading: true }, type: "set" });
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const studentList = await spreadsheetToStudentList(studentListString);
      setState({ newStudents: studentList });
      appDispatch({ payload: { loading: false }, type: "set" });
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
      <StudentDatabaseToolbar
        handleAddStudentClick={handleStudentDialogOpen}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleGenerateFGRClick={handleGenerateFGRClick}
        handleImportClick={onInputChange}
        handleSearchStringChange={handleSearchStringChange}
        page={page}
        rowsPerPage={rowsPerPage}
        students={searchString ? filteredStudents : students}
      />
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
