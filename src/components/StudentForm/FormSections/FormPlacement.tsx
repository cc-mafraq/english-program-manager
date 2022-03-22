import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { GridContainer, GridItemDatePicker, GridItemTextField, LabeledCheckbox, StudentFormLabel } from "..";
import { useDateInitialState, useFormList } from "../../../hooks";
import { Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormList } from "../FormList";
import { FormDateItem } from "./ListItems";

export const FormPlacement: React.FC = () => {
  const methods = useFormContext<Student>();

  const [classScheduleSentDate, addClassScheduleSentDate, removeClassScheduleSentDate] = useFormList(
    useDateInitialState("placement.classScheduleSentDate"),
    "placement.classScheduleSentDate",
    methods,
  );

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Placement</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemTextField gridProps={{ xs: 5 }} label="Sections Offered" name="placement.sectionsOffered" />
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
        <Grid item xs={3}>
          <LabeledCheckbox label="No Answer CS WPM" name="placement.noAnswerClassScheduleWPM" />
        </Grid>
        <GridItemTextField gridProps={{ xs: 5 }} label="Photo Contact" name="placement.photoContact" />
      </GridContainer>
      <GridContainer>
        <GridItemTextField gridProps={{ xs: 5 }} label="Placement and Date" name="placement.placement" />
        <GridItemTextField gridProps={{ xs: 5 }} label="Notes" />
        <Grid item xs={2}>
          <LabeledCheckbox label="Added to CL" />
        </Grid>
      </GridContainer>
    </>
  );
};
