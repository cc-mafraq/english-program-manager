import React, { useMemo } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { FormPlacementSessionItem } from "..";
import { useFormList, useStudentStore } from "../../../hooks";
import { getAllSessionsWithPlacement, SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer, GridItemDatePicker } from "../../reusables";

export const FormPlacement = <T extends FieldValues>() => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const methods = useFormContext<T>();

  const [sessionPlacements, addSessionPlacement, removeSessionPlacement] = useFormList<T>(
    selectedStudent && selectedStudent.placement ? selectedStudent.placement : [],
    "placement",
    methods,
  );

  const allSessions = useMemo(() => {
    return getAllSessionsWithPlacement(students);
  }, [students]);

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Placement</FormLabel>
      <GridContainer marginBottom={0}>
        <GridItemDatePicker gridProps={{ xs: 5 }} label="Photo Contact" name="photoContact" />
        <FormList
          addItem={addSessionPlacement}
          buttonLabel="Add Placement Session"
          list={sessionPlacements}
          listName="placement"
          removeItem={removeSessionPlacement}
          reverseList
        >
          <FormPlacementSessionItem sessions={allSessions} />
        </FormList>
      </GridContainer>
    </>
  );
};
