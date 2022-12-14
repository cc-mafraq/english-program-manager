import { Grid } from "@mui/material";
import React from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { useDateInitialState, useFormList, useStudentStore } from "../../../hooks";
import { SPACING } from "../../../services";
import {
  FormLabel,
  FormList,
  GridContainer,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
} from "../../reusables";
import { FormDateItem, FormPlacementItem } from "./ListItems";

interface FormPlacementProps {
  standAlone?: boolean;
}

export const FormPlacement = <T extends FieldValues>({ standAlone }: FormPlacementProps) => {
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const methods = useFormContext<T>();
  const namePrefix = standAlone ? "" : "placement.";

  const [classScheduleSentDate, addClassScheduleSentDate, removeClassScheduleSentDate] = useFormList<T>(
    useDateInitialState(`${namePrefix}classScheduleSentDate`),
    `${namePrefix}classScheduleSentDate`,
    methods,
  );

  const [placements, addPlacement, removePlacement] = useFormList<T>(
    selectedStudent && selectedStudent.placement.placement?.length > 0 ? selectedStudent.placement.placement : [],
    `${namePrefix}placement`,
    methods,
  );

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Placement</FormLabel>
      <GridContainer marginBottom={0}>
        <GridItemTextField gridProps={{ xs: 5 }} label="Sections Offered" name={`${namePrefix}sectionsOffered`} />
        <FormList
          addItem={addClassScheduleSentDate}
          buttonLabel="Add CS Sent Date"
          list={classScheduleSentDate}
          listName={`${namePrefix}classScheduleSentDate`}
          removeItem={removeClassScheduleSentDate}
        >
          <FormDateItem>
            <GridItemDatePicker gridProps={{ sm: 5, xs: 4.5 }} label="Class Schedule Sent Date" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <Grid item sm={2} xs={3}>
          <LabeledCheckbox label="Pending" name={`${namePrefix}pending`} />
        </Grid>
        <Grid item sm={3} xs={4}>
          <LabeledCheckbox label="No Answer CS WPM" name={`${namePrefix}noAnswerClassScheduleWpm`} />
        </Grid>
        <GridItemDatePicker gridProps={{ xs: 5 }} label="Photo Contact" name={`${namePrefix}photoContact`} />
      </GridContainer>
      <GridContainer marginBottom={standAlone ? 0 : SPACING * 2}>
        <FormList
          addItem={addPlacement}
          buttonLabel="Add Placement"
          list={placements}
          listName={`${namePrefix}placement`}
          removeItem={removePlacement}
        >
          <FormPlacementItem />
        </FormList>
      </GridContainer>
    </>
  );
};

FormPlacement.defaultProps = {
  standAlone: false,
};
