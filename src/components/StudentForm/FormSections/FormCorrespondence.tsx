import React, { useContext } from "react";
import { get, useFormContext } from "react-hook-form";
import { useFormList } from "../../../hooks";
import { AppContext } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer } from "../../reusables";
import { FormCorrespondenceItem } from "./ListItems";

interface FormCorrespondenceProps {
  selectedStudentPath: string;
}

export const FormCorrespondence = <T extends object>({ selectedStudentPath }: FormCorrespondenceProps) => {
  const { appState } = useContext(AppContext);
  const selectedData = get(appState, selectedStudentPath);

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
