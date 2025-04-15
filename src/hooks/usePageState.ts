import { every, filter, filter as filterFn, get, includes } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { FilterValue } from "../interfaces";
import { loadLocal } from "./useLocal";

interface UsePageStateParams<T> {
  filter?: FilterValue<T>[];
  list: T[];
  // a doc won't be added to the list unless it has a value at this path
  requiredValuePath?: string;
  searchFn?: (list: T[], searchString: string) => T[];
  sortFn: (list: T[]) => T[];
}

export const usePageState = <T>({
  list,
  searchFn,
  sortFn,
  filter: dataFilter,
  requiredValuePath,
}: UsePageStateParams<T>) => {
  const [searchString, setSearchString] = useState<string>("");
  const [showActions, setShowActions] = useState(loadLocal("showActions") !== false);

  const sortedList = useMemo(() => {
    const newDataList = filter(list, (data) => {
      return !requiredValuePath || get(data, requiredValuePath);
    });
    return sortFn ? sortFn(newDataList as T[]) : (newDataList as T[]);
  }, [list, requiredValuePath, sortFn]);

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
