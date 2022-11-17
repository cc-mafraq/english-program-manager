import React, { useContext } from "react";
import { get, useFormContext } from "react-hook-form";
import { useStore } from "zustand";
import { AppContext } from "../../../App";
import { useFormList } from "../../../hooks";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer } from "../../reusables";
import { FormCorrespondenceItem } from "./ListItems";

interface FormCorrespondenceProps {
  selectedStudentPath: string;
}

export const FormCorrespondence = <T extends object>({ selectedStudentPath }: FormCorrespondenceProps) => {
  const store = useContext(AppContext);
  const selectedData = useStore(store, (state) => {
    return get(state, selectedStudentPath);
  });

  const methods = useFormContext<T>();
  const [correspondence, addCorrespondence, removeCorrespondence] = useFormList(
    selectedData && selectedData.correspondence ? selectedData?.correspondence : [],
    "correspondence",
    methods,
  );

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Correspondence</FormLabel>
      <GridContainer>
        <FormList
          addItem={addCorrespondence}
          buttonLabel="Add Correspondence"
          list={correspondence}
          listName="correspondence"
          removeItem={removeCorrespondence}
          reverseList
        >
          <FormCorrespondenceItem />
        </FormList>
      </GridContainer>
    </>
  );
};
