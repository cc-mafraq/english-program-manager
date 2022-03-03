import { cloneDeep, isUndefined, set } from "lodash";
import { useState } from "react";
import { ArrayPath, FieldArrayPathValue, Path, PathValue, UseFormReturn } from "react-hook-form";
import { Student } from "../interfaces";

export const useFormList = (
  initialState: FieldArrayPathValue<Student, ArrayPath<Student>>,
  listPath: Path<Student>,
  methods: UseFormReturn<Student, object>,
): [
  FieldArrayPathValue<Student, ArrayPath<Student>>,
  () => void,
  (index?: number) => () => void,
] => {
  const [list, setList] = useState<FieldArrayPathValue<Student, ArrayPath<Student>>>(initialState);

  const addListItem = () => {
    setList([...list, {}] as PathValue<Student, ArrayPath<Student>>);
  };

  const removeListItem = (index?: number) => {
    return () => {
      if (isUndefined(index)) return;
      const newList = cloneDeep(list);
      newList.splice(index, 1);
      setList(newList);
      const resetObject = {};
      set(resetObject, listPath, []);
      methods.reset(resetObject);
      methods.setValue(listPath, newList);
    };
  };

  return [list, addListItem, removeListItem];
};
