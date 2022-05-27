import { cloneDeep, constant, get, includes, isUndefined, map, set, times } from "lodash";
import { useContext, useState } from "react";
import { DeepPartial, Path, PathValue, UnpackNestedValue, UseFormReturn } from "react-hook-form";
import { AppContext } from "../interfaces";

export const useFormList = <T>(
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
      methods.reset(resetObject as UnpackNestedValue<DeepPartial<T>>, { keepValues: true });
      methods.setValue(listPath as Path<T>, newList as UnpackNestedValue<PathValue<T, Path<T>>>);
      if (listPath === "phone.phoneNumbers") {
        const currentPrimaryPhone = get(methods.getValues(), "phone.primaryPhone");
        methods.setValue(
          "phone.primaryPhone" as Path<T>,
          includes(map(newList, "number"), currentPrimaryPhone)
            ? currentPrimaryPhone
            : times(newList.length, constant(false)),
        );
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
