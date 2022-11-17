import { collection } from "firebase/firestore";
import { every, filter as filterFn, forEach, get, includes, isUndefined, startCase } from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { useStore } from "zustand";
import { AppContext } from "../App";
import { FilterValue } from "../interfaces";
import { db, logout } from "../services";
import { loadLocal } from "./useLocal";

interface UsePageStateParams<T> {
  collectionName: string;
  conditionToAddPath?: string;
  filter?: FilterValue<T>[];
  payloadPath: string;
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
  searchFn,
  sortFn,
  filter,
  payloadPath,
  collectionName,
  spreadsheetIsLoading,
  conditionToAddPath,
}: UsePageStateParams<T>) => {
  const store = useContext(AppContext);
  const setData = useStore(store, (state) => {
    return get(state, `set${startCase(payloadPath)}`.replace(/ /g, ""));
  });
  const setLoading = useStore(store, (state) => {
    return state.setLoading;
  });

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
              !isUndefined(newList) ? newList : filteredListRef.current,
              !isUndefined(newSearchString) ? newSearchString : searchStringRef.current,
            )
          : filteredListRef.current;
      const newFilteredList =
        filter && filter.length > 0 ? sortFn(filterFn(newSearchedList, filterList) as T[]) : newSearchedList;
      setFilteredList(newFilteredList);
      newList && setData(newList);
      !isUndefined(newSearchString) && setSearchString(newSearchString);
      setListPage(newFilteredList);
    },
    [
      searchFn,
      searchStringRef,
      filteredListRef,
      filter,
      sortFn,
      filterList,
      setFilteredList,
      setData,
      setSearchString,
    ],
  );

  useEffect(() => {
    if (!spreadsheetIsLoading) {
      const newDataList: T[] = [];
      forEach(docs?.docs, (d) => {
        const data = d.data();
        if (!conditionToAddPath || get(data, conditionToAddPath)) newDataList.push(data as T);
      });
      const sortedData = sortFn(newDataList);
      setState({
        newList: sortedData,
      });
    }
  }, [setState, docs, sortFn, spreadsheetIsLoading, conditionToAddPath]);

  useEffect(() => {
    setLoading(docsLoading);
  }, [docsLoading, setLoading]);

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
