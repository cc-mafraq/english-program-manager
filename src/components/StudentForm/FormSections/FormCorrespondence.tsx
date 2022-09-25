import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useFormList } from "../../../hooks";
import { AppContext, Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormList, GridContainer } from "../../reusables";
import { StudentFormLabel } from "../StudentFormLabel";
import { FormCorrespondenceItem } from "./ListItems";

export const FormCorrespondence: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  const methods = useFormContext<Student>();
  const [correspondence, addCorrespondence, removeCorrespondence] = useFormList(
    selectedStudent && selectedStudent.correspondence ? selectedStudent?.correspondence : [],
    "correspondence",
    methods,
  );

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Correspondence</StudentFormLabel>
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
