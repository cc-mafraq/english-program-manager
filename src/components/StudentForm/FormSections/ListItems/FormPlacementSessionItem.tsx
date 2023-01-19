import { Close } from "@mui/icons-material";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import React, { useMemo } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { useColors, useDateInitialState, useFormList, useStudentStore } from "../../../../hooks";
import { FormItem, getAllSessions, SPACING } from "../../../../services";
import {
  FormLabel,
  FormList,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
} from "../../../reusables";
import { FormDateItem } from "./FormDateItem";
import { FormPlacementItem } from "./FormPlacementItem";

export const FormPlacementSessionItem = <T extends FieldValues>({ index, removeItem, name }: FormItem) => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const methods = useFormContext<T>();
  const { iconColor } = useColors();

  const [classScheduleSentDate, addClassScheduleSentDate, removeClassScheduleSentDate] = useFormList<T>(
    useDateInitialState<string>(name ? `${name}.classScheduleSentDate` : "classScheduleSentDate"),
    name ? `${name}.classScheduleSentDate` : "classScheduleSentDate",
    methods,
  );

  const [placements, addPlacement, removePlacement] = useFormList<T>(
    selectedStudent &&
      selectedStudent.placement?.length > 0 &&
      selectedStudent.placement[index || 0]?.placement.length > 0
      ? selectedStudent.placement[index || 0].placement
      : [],
    name ? `${name}.placement` : "placement",
    methods,
  );

  const sessions = useMemo(() => {
    return getAllSessions(students);
  }, [students]);

  return (
    <Box>
      <Grid container marginLeft={SPACING}>
        <FormLabel textProps={{ marginTop: SPACING }}>Placement Session</FormLabel>
        {removeItem && (
          <Tooltip arrow title="Remove Placement Session">
            <IconButton
              onClick={removeItem(index)}
              sx={{ color: iconColor, marginTop: "1.5vh", position: "absolute", right: "1.5vh" }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
      <GridContainer marginBottom={0} marginLeft={0}>
        <GridItemAutocomplete
          freeSolo
          gridProps={{ md: 3, xs: 6 }}
          label="Session"
          name={name ? `${name}.session` : "session"}
          options={sessions}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField
          gridProps={{ xs: 5 }}
          label="Sections Offered"
          name={name ? `${name}.sectionsOffered` : "sectionsOffered"}
        />
        <Grid item sm={3} xs={4}>
          <LabeledCheckbox
            containerProps={{ marginTop: -2 }}
            label="Pending"
            name={name ? `${name}.pending` : "pending"}
          />
          <LabeledCheckbox
            containerProps={{ marginTop: -1 }}
            label="No Answer CS WPM"
            name={name ? `${name}.noAnswerClassScheduleWpm` : "noAnswerClassScheduleWpm"}
          />
        </Grid>
      </GridContainer>
      <GridContainer marginBottom={0} marginLeft={0}>
        <FormList
          addItem={addClassScheduleSentDate}
          buttonLabel="Add CS Sent Date"
          list={classScheduleSentDate}
          listName={name ? `${name}.classScheduleSentDate` : "classScheduleSentDate"}
          removeItem={removeClassScheduleSentDate}
        >
          <FormDateItem>
            <GridItemDatePicker gridProps={{ md: 3, xs: 6 }} label="Class Schedule Sent Date" />
          </FormDateItem>
        </FormList>
        <GridContainer marginBottom={0} marginLeft={0}>
          <FormList
            addItem={addPlacement}
            buttonLabel="Add Placement"
            list={placements}
            listName={name ? `${name}.placement` : "placement"}
            removeItem={removePlacement}
          >
            <FormPlacementItem />
          </FormList>
        </GridContainer>
      </GridContainer>
    </Box>
  );
};
