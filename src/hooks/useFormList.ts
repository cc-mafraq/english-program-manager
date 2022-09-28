import { cloneDeep, find, get, isUndefined, set } from "lodash";
import { useContext, useState } from "react";
import { DeepPartial, FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { AppContext } from "../interfaces";

export const useFormList = <T extends FieldValues>(
  initialState: unknown[],
  listPath: string,
  methods: UseFormReturn<T, object>,
): [unknown[], () => void, (index?: number) => () => void] => {
  const [list, setList] = useState(initialState);

  const addListItem = () => {
    setList([...list, {}]);
  };

  const removeListItem = (index?: number) => {
    return () => {
      if (isUndefined(index)) return;
      const newList = cloneDeep(methods.getValues(listPath as unknown as Path<T>[]));
      newList.splice(index, 1);
      setList(newList);
      const resetObject = {};
      set(resetObject, listPath, []);
      methods.reset(resetObject as T | DeepPartial<T> | undefined, { keepValues: true });
      methods.setValue(listPath as Path<T>, newList as PathValue<T, Path<T>>);
      const phoneListPath = find(["phoneNumbers", "phone.phoneNumbers"], listPath);
      if (phoneListPath) {
        const currentPrimaryPhoneList = get(methods.getValues(), phoneListPath);
        currentPrimaryPhoneList.splice(index, 1);
        methods.setValue(phoneListPath as Path<T>, currentPrimaryPhoneList);
      }
    };
  };

  return [list, addListItem, removeListItem];
};

export const useDateInitialState = <T>(datePath: Path<T>) => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);
  const dateArr = get(selectedStudent, datePath);

  return selectedStudent && dateArr && dateArr?.length > 0 ? dateArr : [""];
};
