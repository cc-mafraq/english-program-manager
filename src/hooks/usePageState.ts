import { collection } from "firebase/firestore";
import { every, filter as filterFn, forEach, get, includes } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";
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
}

export const usePageState = <T>({
  searchFn,
  sortFn,
  filter,
  setData,
  collectionName,
  requiredValuePath,
}: UsePageStateParams<T>) => {
  const setLoading = useAppStore((state) => {
    return state.setLoading;
  });

  const [searchString, setSearchString] = useState<string>("");
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);
  const navigate = useNavigate();
  const [docs, docsLoading, docsError] = useCollection(collection(db, collectionName));

  const sortedList = useMemo(() => {
    const newDataList: T[] = [];
    forEach(docs?.docs, (d) => {
      const data = d.data();
      if (!requiredValuePath || get(data, requiredValuePath)) newDataList.push(data as T);
    });
    const newSortedList = sortFn(newDataList);
    return newSortedList;
  }, [docs?.docs, requiredValuePath, sortFn]);

  const searchedList = useMemo(() => {
    return searchString ? searchFn(sortedList, searchString) : sortedList;
  }, [searchFn, searchString, sortedList]);

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

  const filteredList = useMemo(() => {
    return filter && filter.length > 0 ? sortFn(filterFn(searchedList, filterList) as T[]) : searchedList;
  }, [filter, filterList, searchedList, sortFn]);

  useEffect(() => {
    setData(sortedList);
  }, [setData, sortedList]);

  useEffect(() => {
    setLoading(docsLoading);
  }, [docsLoading, setLoading]);

  useEffect(() => {
    if (docsError?.code === "permission-denied") {
      logout();
      navigate("/");
    }
  }, [navigate, docsError]);

  const handleSearchStringChange = useCallback(
    (value: string) => {
      setSearchString(value);
    },
    [setSearchString],
  );

  return {
    filteredList,
    handleSearchStringChange,
    searchString,
    setShowActions,
    showActions,
    sortedList,
  };
};
