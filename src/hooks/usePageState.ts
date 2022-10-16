import { collection } from "firebase/firestore";
import { every, filter as filterFn, forEach, get, includes, isUndefined, set } from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { AppContext, AppState, FilterValue } from "../interfaces";
import { db, logout } from "../services";
import { loadLocal } from "./useLocal";

interface UsePageStateParams<T> {
  collectionName: string;
  conditionToAddPath?: string;
  filter?: FilterValue<T>[];
  listRef: React.MutableRefObject<T[]>;
  payloadPath: keyof AppState;
  searchFn: (list: T[], searchString: string) => T[];
  sortFn: (list: T[]) => T[];
  spreadsheetIsLoading?: boolean;
}

interface SetStateOptions<T> {
  newList?: T[];
  newPage?: number;
  newRowsPerPage?: number;
  newSearchString?: string;
}

export const usePageState = <T>({
  listRef,
  searchFn,
  sortFn,
  filter,
  payloadPath,
  collectionName,
  spreadsheetIsLoading,
  conditionToAddPath,
}: UsePageStateParams<T>) => {
  const { appDispatch } = useContext(AppContext);

  const [filteredList, setFilteredList, filteredListRef] = useState<T[]>([]);
  const [listPage, setListPage] = useState<T[]>([]);
  const [searchString, setSearchString, searchStringRef] = useState<string>("");
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);
  const navigate = useNavigate();
  const [docs, docsLoading, docsError] = useCollection(collection(db, collectionName));

  const filterList = useCallback(
    (object: T) => {
      return every(filter, (filterValue) => {
        const value = filterValue.fieldFunction
          ? filterValue.fieldFunction(object)
          : get(object, filterValue.fieldPath);
        return includes(filterValue.values, value);
      });
    },
    [filter],
  );

  const setState = useCallback(
    ({ newSearchString, newList }: SetStateOptions<T>) => {
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
      !isUndefined(newSearchString) && setSearchString(newSearchString);
      setListPage(newFilteredList);
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
      setSearchString,
    ],
  );

  useEffect(() => {
    if (!spreadsheetIsLoading) {
      const dataList: T[] = [];
      forEach(docs?.docs, (d) => {
        const data = d.data();
        if (!conditionToAddPath || get(data, conditionToAddPath)) dataList.push(data as T);
      });
      const sortedData = sortFn(dataList);
      setState({
        newList: sortedData,
      });
    }
  }, [setState, appDispatch, docs, sortFn, spreadsheetIsLoading, conditionToAddPath]);

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

  const handleSearchStringChange = useCallback(
    (value: string) => {
      setState({ newPage: 0, newSearchString: value });
    },
    [setState],
  );

  return {
    filteredList,
    handleSearchStringChange,
    listPage,
    searchString,
    setShowActions,
    showActions,
  };
};
