import { Grid } from "@mui/material";
import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormDateItem,
  FormPlacementItem,
  GridContainer,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
  StudentFormLabel,
} from "..";
import { useDateInitialState, useFormList } from "../../../hooks";
import { AppContext, Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormList } from "../FormList";

export const FormPlacement: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);
  const methods = useFormContext<Student>();

  const [classScheduleSentDate, addClassScheduleSentDate, removeClassScheduleSentDate] = useFormList(
    useDateInitialState("placement.classScheduleSentDate"),
    "placement.classScheduleSentDate",
    methods,
  );

  const [placements, addPlacement, removePlacement] = useFormList(
    selectedStudent && selectedStudent.placement.placement?.length > 0
      ? selectedStudent.placement.placement
      : [{}],
    "placement.placement",
    methods,
  );

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Placement</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemTextField gridProps={{ xs: 6 }} label="Sections Offered" name="placement.sectionsOffered" />
        <FormList
          addItem={addClassScheduleSentDate}
          buttonLabel="Add CS Sent Date"
          list={classScheduleSentDate}
          listName="placement.classScheduleSentDate"
          removeItem={removeClassScheduleSentDate}
        >
          <FormDateItem>
            <GridItemDatePicker label="Class Schedule Sent Date" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <Grid item xs={2}>
          <LabeledCheckbox label="Pending" name="placement.pending" />
        </Grid>
        <Grid item xs={4}>
          <LabeledCheckbox label="No Answer CS WPM" name="placement.noAnswerClassScheduleWPM" />
        </Grid>
        <GridItemTextField gridProps={{ xs: 5 }} label="Photo Contact" name="placement.photoContact" />
      </GridContainer>
      <GridContainer>
        <FormList
          addItem={addPlacement}
          buttonLabel="Add Placement"
          list={placements}
          listName="placement.placement"
          removeItem={removePlacement}
        >
          <FormPlacementItem />
        </FormList>
      </GridContainer>
    </>
  );
};
