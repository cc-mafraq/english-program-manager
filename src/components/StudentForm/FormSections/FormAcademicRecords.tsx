import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { FormAcademicRecordsItem, FormList, GridContainer } from "..";
import { useFormList } from "../../../hooks";
import { AppContext, Student } from "../../../interfaces";

export const FormAcademicRecords: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  const methods = useFormContext<Student>();
  const [academicRecords, addAcademicRecord, removeAcademicRecord] = useFormList(
    selectedStudent && selectedStudent.academicRecords ? selectedStudent.academicRecords : [],
    "academicRecords",
    methods,
  );

  return (
    <GridContainer marginBottom={0}>
      <FormList
        addItem={addAcademicRecord}
        buttonLabel="Add Academic Record"
        list={academicRecords}
        listName="academicRecords"
        removeItem={removeAcademicRecord}
      >
        <FormAcademicRecordsItem />
      </FormList>
    </GridContainer>
  );
};
