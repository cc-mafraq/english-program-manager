import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { FormCorrespondenceItem, FormList, GridContainer, StudentFormLabel } from "..";
import { useFormList } from "../../../hooks";
import { AppContext, Student } from "../../../interfaces";
import { SPACING } from "../../../services";

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
          removeItem={removeCorrespondence}
        >
          <FormCorrespondenceItem />
        </FormList>
      </GridContainer>
    </>
  );
};
