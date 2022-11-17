import { collection } from "firebase/firestore";
import { every, filter as filterFn, forEach, get, includes, isUndefined } from "lodash";
import { useCallback, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { FilterValue } from "../interfaces";
import { db, logout } from "../services";
import { loadLocal } from "./useLocal";
import { useAppStore } from "./useStores";

interface UsePageStateParams<T> {
  collectionName: string;
  filter: FilterValue<T>[];
  payloadPath: string;
  // a doc won't be added to the list unless it has a value at this path
  requiredValuePath?: string;
  searchFn: (list: T[], searchString: string) => T[];
  setData: (data: T[]) => void;
  sortFn: (list: T[]) => T[];
  spreadsheetIsLoading?: boolean;
}

interface SetStateOptions<T> {
  newList?: T[];
  newSearchString?: string;
}

export const usePageState = <T>({
  searchFn,
  sortFn,
  filter,
  setData,
  collectionName,
  spreadsheetIsLoading,
  requiredValuePath,
}: UsePageStateParams<T>) => {
  const setLoading = useAppStore((state) => {
    return state.setLoading;
  });

  const [list, setList, listRef] = useState<T[]>([]);
  const [filteredList, setFilteredList, filteredListRef] = useState<T[]>([]);
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
      newList && setList(newList);
      const newSearchedList =
        !isUndefined(newSearchString) || newList
          ? searchFn(
              !isUndefined(newList) ? newList : listRef.current,
              !isUndefined(newSearchString) ? newSearchString : searchStringRef.current,
            )
          : filteredListRef.current;
      const newFilteredList =
        filter && filter.length > 0 ? sortFn(filterFn(newSearchedList, filterList) as T[]) : newSearchedList;
      setFilteredList(newFilteredList);
      newList && setData(newList);
      !isUndefined(newSearchString) && setSearchString(newSearchString);
    },
    [
      searchFn,
      listRef,
      searchStringRef,
      filteredListRef,
      filter,
      sortFn,
      filterList,
      setFilteredList,
      setData,
      setSearchString,
      setList,
    ],
  );

  useEffect(() => {
    if (!spreadsheetIsLoading) {
      const newDataList: T[] = [];
      forEach(docs?.docs, (d) => {
        const data = d.data();
        if (!requiredValuePath || get(data, requiredValuePath)) newDataList.push(data as T);
      });
      const sortedData = sortFn(newDataList);
      setState({
        newList: sortedData,
      });
    }
  }, [setState, docs, sortFn, spreadsheetIsLoading, requiredValuePath]);

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
      setState({ newSearchString: value });
    },
    [setState],
  );

  return {
    filteredList,
    handleSearchStringChange,
    list,
    searchString,
    setShowActions,
    showActions,
  };
};
