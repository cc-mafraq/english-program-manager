import { every, filter as filterFn, get, includes, isUndefined } from "lodash";
import { useCallback, useContext } from "react";
import useState from "react-usestateref";
import { AppContext, Student } from "../interfaces";
import { getStudentPage, searchStudents } from "../services";
import { loadLocal, saveLocal } from "./useLocal";

interface SetStateOptions {
  newPage?: number;
  newRowsPerPage?: number;
  newSearchString?: string;
  newStudents?: Student[];
}

export const usePageState = ({ studentsRef }: { studentsRef: React.MutableRefObject<Student[]> }) => {
  const {
    appState: { filter },
    appDispatch,
  } = useContext(AppContext);

  const [filteredStudents, setFilteredStudents, filteredStudentsRef] = useState<Student[]>([]);
  const [studentsPage, setStudentsPage] = useState<Student[]>([]);
  const [page, setPage, pageRef] = useState(0);
  const [rowsPerPage, setRowsPerPage, rowsPerPageRef] = useState(
    parseInt(loadLocal("rowsPerPage") as string) || -1,
  );
  const [searchString, setSearchString, searchStringRef] = useState<string>("");
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);

  const filterStudents = useCallback(
    (student: Student) => {
      return every(filter, (filterValue) => {
        const value = filterValue.fieldFunction
          ? filterValue.fieldFunction(student)
          : get(student, filterValue.fieldPath);
        return includes(filterValue.values, value);
      });
    },
    [filter],
  );

  const setState = useCallback(
    ({ newRowsPerPage, newPage, newSearchString, newStudents }: SetStateOptions) => {
      const newSearchedStudents =
        !isUndefined(newSearchString) || newStudents
          ? searchStudents(
              !isUndefined(newStudents) ? newStudents : studentsRef.current,
              !isUndefined(newSearchString) ? newSearchString : searchStringRef.current,
            )
          : filteredStudentsRef.current;
      const newFilteredStudents =
        filter.length > 0 ? (filterFn(newSearchedStudents, filterStudents) as Student[]) : newSearchedStudents;
      setFilteredStudents(newFilteredStudents);
      newStudents && appDispatch({ payload: { students: newStudents } });
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
      filter.length,
      filterStudents,
      filteredStudentsRef,
      pageRef,
      rowsPerPageRef,
      searchStringRef,
      setFilteredStudents,
      setPage,
      setRowsPerPage,
      setSearchString,
      studentsRef,
    ],
  );

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setState({ newPage });
    },
    [setState],
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      saveLocal("rowsPerPage", newRowsPerPage);
      setState({ newPage: 0, newRowsPerPage });
    },
    [setState],
  );

  const handleSearchStringChange = useCallback(
    (value: string) => {
      setState({ newPage: 0, newSearchString: value });
    },
    [setState],
  );

  return {
    filteredStudents,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchStringChange,
    page,
    rowsPerPage,
    searchString,
    setState,
    studentsPage,
    showActions,
    setShowActions,
  };
};
