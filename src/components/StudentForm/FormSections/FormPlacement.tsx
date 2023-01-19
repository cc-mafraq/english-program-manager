import React from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { FormPlacementSessionItem } from "..";
import { useFormList, useStudentStore } from "../../../hooks";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer, GridItemDatePicker } from "../../reusables";

export const FormPlacement = <T extends FieldValues>() => {
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const methods = useFormContext<T>();

  const [sessionPlacements, addSessionPlacement, removeSessionPlacement] = useFormList<T>(
    selectedStudent && selectedStudent.placement ? selectedStudent.placement : [],
    "placement",
    methods,
  );

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
          <FormPlacementSessionItem />
        </FormList>
      </GridContainer>
    </>
  );
};

FormPlacement.defaultProps = {
  standAlone: false,
};
