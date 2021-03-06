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
import { AppContext } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormList } from "../FormList";

interface FormPlacementProps {
  standAlone?: boolean;
}

export const FormPlacement = <T,>({ standAlone }: FormPlacementProps) => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);
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
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Placement</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemTextField gridProps={{ xs: 6 }} label="Sections Offered" name={`${namePrefix}sectionsOffered`} />
        <FormList
          addItem={addClassScheduleSentDate}
          buttonLabel="Add CS Sent Date"
          list={classScheduleSentDate}
          listName={`${namePrefix}classScheduleSentDate`}
          removeItem={removeClassScheduleSentDate}
        >
          <FormDateItem>
            <GridItemDatePicker label="Class Schedule Sent Date" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <Grid item xs={2}>
          <LabeledCheckbox label="Pending" name={`${namePrefix}pending`} />
        </Grid>
        <Grid item xs={4}>
          <LabeledCheckbox label="No Answer CS WPM" name={`${namePrefix}noAnswerClassScheduleWpm`} />
        </Grid>
        <GridItemTextField gridProps={{ xs: 5 }} label="Photo Contact" name={`${namePrefix}photoContact`} />
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
