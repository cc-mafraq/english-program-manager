import { every, filter as filterFn, get, includes, isUndefined, set } from "lodash";
import { useCallback, useContext } from "react";
import useState from "react-usestateref";
import { AppContext, AppState, FilterValue } from "../interfaces";
import { getPage } from "../services";
import { loadLocal, saveLocal } from "./useLocal";

interface UsePageStateParams<T> {
  filter?: FilterValue<T>[];
  listRef: React.MutableRefObject<T[]>;
  payloadPath: keyof AppState;
  searchFn: (list: T[], searchString: string) => T[];
}

interface SetStateOptions<T> {
  newList?: T[];
  newPage?: number;
  newRowsPerPage?: number;
  newSearchString?: string;
}

export const usePageState = <T>({ listRef, searchFn, filter, payloadPath }: UsePageStateParams<T>) => {
  const { appDispatch } = useContext(AppContext);

  const [filteredList, setFilteredList, filteredListRef] = useState<T[]>([]);
  const [listPage, setListPage] = useState<T[]>([]);
  const [page, setPage, pageRef] = useState(0);
  const [rowsPerPage, setRowsPerPage, rowsPerPageRef] = useState(
    parseInt(loadLocal("rowsPerPage") as string) || -1,
  );
  const [searchString, setSearchString, searchStringRef] = useState<string>("");
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);

  const filterList = useCallback(
    (object: T) => {
      return every(filter, (filterValue) => {
        const value = filterValue.fieldFunction
          ? filterValue.fieldFunction(object)
          : get(object, filterValue.fieldPath);
        console.log(value);
        console.log(filterValue.values);
        return includes(filterValue.values, value);
      });
    },
    [filter],
  );

  const setState = useCallback(
    ({ newRowsPerPage, newPage, newSearchString, newList }: SetStateOptions<T>) => {
      const newSearchedList =
        !isUndefined(newSearchString) || newList
          ? searchFn(
              !isUndefined(newList) ? newList : listRef.current,
              !isUndefined(newSearchString) ? newSearchString : searchStringRef.current,
            )
          : filteredListRef.current;
      const newFilteredList =
        filter && filter.length > 0 ? (filterFn(newSearchedList, filterList) as T[]) : newSearchedList;
      setFilteredList(newFilteredList);
      const newPayload: Partial<AppState> = {};
      set(newPayload, payloadPath, newList);
      newList && appDispatch({ payload: newPayload });
      !isUndefined(newPage) && setPage(newPage);
      newRowsPerPage && setRowsPerPage(newRowsPerPage);
      !isUndefined(newSearchString) && setSearchString(newSearchString);
      setListPage(
        getPage(
          newFilteredList,
          !isUndefined(newPage) ? newPage : pageRef.current,
          newRowsPerPage || rowsPerPageRef.current,
        ),
      );
    },
    [
      searchFn,
      listRef,
      searchStringRef,
      filteredListRef,
      filter,
      filterList,
      setFilteredList,
      payloadPath,
      appDispatch,
      setPage,
      setRowsPerPage,
      setSearchString,
      pageRef,
      rowsPerPageRef,
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
    filteredList,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchStringChange,
    listPage,
    page,
    rowsPerPage,
    searchString,
    setShowActions,
    setState,
    showActions,
  };
};
