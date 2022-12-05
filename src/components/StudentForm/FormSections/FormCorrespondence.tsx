import React from "react";
import { get, useFormContext } from "react-hook-form";
import { useFormList } from "../../../hooks";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer } from "../../reusables";
import { FormCorrespondenceItem } from "./ListItems";

interface FormCorrespondenceProps<T> {
  selectedData: T | null;
}

export const FormCorrespondence = <T extends object>({ selectedData }: FormCorrespondenceProps<T>) => {
  const methods = useFormContext<T>();
  const [correspondence, addCorrespondence, removeCorrespondence] = useFormList(
    selectedData && get(selectedData, "correspondence") ? get(selectedData, "correspondence") : [],
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
