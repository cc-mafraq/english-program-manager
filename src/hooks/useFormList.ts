import { cloneDeep, isUndefined, set } from "lodash";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export const useFormList = <T>(initialState: T[], listPath: string) => {
  const [list, setList] = useState<T[]>(initialState);
  const { setValue, reset } = useFormContext();

  const addListItem = async () => {
    setList([...list, {} as T]);
  };

  const removeListItem = (index?: number) => {
    return () => {
      if (isUndefined(index)) return;
      const newList = cloneDeep(list);
      newList.splice(index, 1);
      setList(newList);
      const resetObject = {};
      set(resetObject, listPath, []);
      reset(resetObject);
      setValue(listPath, newList);
    };
  };

  return [list, addListItem, removeListItem];
};
