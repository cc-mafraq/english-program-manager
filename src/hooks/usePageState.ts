import { collection } from "firebase/firestore";
import { every, filter, filter as filterFn, get, includes, map } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { FilterValue } from "../interfaces";
import { db, logout } from "../services";
import { loadLocal } from "./useLocal";
import { useAppStore } from "./useStores";

interface UsePageStateParams<T> {
  collectionName: string;
  filter?: FilterValue<T>[];
  // a doc won't be added to the list unless it has a value at this path
  requiredValuePath?: string;
  searchFn?: (list: T[], searchString: string) => T[];
  setData: (data: T[]) => void;
  sortFn: (list: T[]) => T[];
}

export const usePageState = <T>({
  searchFn,
  sortFn,
  filter: dataFilter,
  setData,
  collectionName,
  requiredValuePath,
}: UsePageStateParams<T>) => {
  const setLoading = useAppStore((state) => {
    return state.setLoading;
  });

  const [searchString, setSearchString] = useState<string>("");
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);
  const [docs, docsLoading, docsError] = useCollection(collection(db, collectionName));

  const sortedList = useMemo(() => {
    const newDataList = filter(
      map(docs?.docs, (d) => {
        return d.data();
      }),
      (data) => {
        return !requiredValuePath || get(data, requiredValuePath);
      },
    );
    return sortFn ? sortFn(newDataList as T[]) : (newDataList as T[]);
  }, [docs?.docs, requiredValuePath, sortFn]);

  const searchedList = useMemo(() => {
    return searchString && searchFn ? searchFn(sortedList, searchString) : sortedList;
  }, [searchFn, searchString, sortedList]);

  const filterList = useCallback(
    (object: T) => {
      return every(dataFilter, (filterValue) => {
        const value = filterValue.fieldFunction
          ? filterValue.fieldFunction(object)
          : get(object, filterValue.fieldPath);
        return includes(filterValue.values, value);
      });
    },
    [dataFilter],
  );

  const filteredList = useMemo(() => {
    return dataFilter && dataFilter.length > 0 ? filterFn(searchedList, filterList) : searchedList;
  }, [dataFilter, filterList, searchedList]);

  // useEffect(() => {
  //   setData(sortedList);
  // }, [setData, sortedList]);

  useEffect(() => {
    setLoading(docsLoading);
  }, [docsLoading, setLoading]);

  useEffect(() => {
    if (docsError?.code === "permission-denied") {
      logout();
    }
  }, [docsError]);

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
