import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useStore } from "zustand";
import { AppContext } from "../../../App";
import { useFormList } from "../../../hooks";
import { Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer } from "../../reusables";
import { FormAcademicRecordsItem } from "./ListItems";

export const FormAcademicRecords: React.FC = () => {
  const store = useContext(AppContext);
  const selectedStudent = useStore(store, (state) => {
    return state.selectedStudent;
  });

  const methods = useFormContext<Student>();
  const [academicRecords, addAcademicRecord, removeAcademicRecord] = useFormList(
    selectedStudent && selectedStudent.academicRecords ? selectedStudent.academicRecords : [],
    "academicRecords",
    methods,
  );

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Academic Records</FormLabel>
      <GridContainer marginBottom={0}>
        <FormList
          addItem={addAcademicRecord}
          buttonLabel="Add Academic Record"
          list={academicRecords}
          listName="academicRecords"
          removeItem={removeAcademicRecord}
          reverseList
        >
          <FormAcademicRecordsItem />
        </FormList>
      </GridContainer>
    </>
  );
};
