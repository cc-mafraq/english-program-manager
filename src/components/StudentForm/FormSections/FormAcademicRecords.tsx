import React from "react";
import { useFormContext } from "react-hook-form";
import { FormAcademicRecordsItem, FormList, GridContainer } from "..";
import { useFormList } from "../../../hooks";
import { Student } from "../../../interfaces";

interface FormAcademicRecordsProps {
  selectedStudent?: Student;
  students: Student[];
}

export const FormAcademicRecords: React.FC<FormAcademicRecordsProps> = ({ selectedStudent, students }) => {
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
        removeItem={removeAcademicRecord}
      >
        <FormAcademicRecordsItem students={students} />
      </FormList>
    </GridContainer>
  );
};

FormAcademicRecords.defaultProps = {
  selectedStudent: undefined,
};
