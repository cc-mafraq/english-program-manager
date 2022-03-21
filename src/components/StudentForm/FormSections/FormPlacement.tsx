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
        <GridItemTextField gridProps={{ xs: 6 }} label="Placement" name="placement.placement" />
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
        <GridItemTextField gridProps={{ xs: 6 }} label="Sections Offered" name="placement.sectionsOffered" />
        <GridItemTextField label="Placement Confirmed Date" name="placement.confDate" />
      </GridContainer>
      <GridContainer>
        <Grid item xs={2}>
          <LabeledCheckbox label="Pending" name="placement.pending" />
        </Grid>
        <Grid item xs={4}>
          <LabeledCheckbox label="No Answer CS WPM" name="placement.noAnswerClassScheduleWPM" />
        </Grid>
        <GridItemDatePicker label="Photo Contact" name="placement.photoContact" />
      </GridContainer>
    </>
  );
};
