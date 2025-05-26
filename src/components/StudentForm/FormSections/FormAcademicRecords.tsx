import React from "react";
import { useFormContext } from "react-hook-form";
import { useFormList, useStudentStore } from "../../../hooks";
import { AcademicRecord } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer } from "../../reusables";
import { FormAcademicRecordsItem } from "./ListItems";

export const FormAcademicRecords: React.FC = () => {
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });

  const methods = useFormContext<AcademicRecord>();
  const [academicRecords, addAcademicRecord, removeAcademicRecord] = useFormList<AcademicRecord>(
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
