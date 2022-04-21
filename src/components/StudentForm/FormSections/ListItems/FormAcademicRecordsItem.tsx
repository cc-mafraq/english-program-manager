import { Close } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import React, { useContext } from "react";
import { FormGrade, GridContainer, GridItemAutocomplete, GridItemTextField, StudentFormLabel } from "../../..";
import { useColors } from "../../../../hooks";
import { AppContext, genderedLevels } from "../../../../interfaces";
import { FormItem, getAllSessions, SPACING } from "../../../../services";

export const FormAcademicRecordsItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const {
    appState: { students },
  } = useContext(AppContext);

  const { iconColor } = useColors();

  return (
    <>
      <Grid container marginLeft={SPACING}>
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Academic Record {Number(index) + 1}</StudentFormLabel>
        <IconButton
          onClick={removeItem && removeItem(index)}
          sx={{ color: iconColor, marginLeft: SPACING / 2, top: "15%" }}
        >
          <Close />
        </IconButton>
      </Grid>
      <GridContainer marginBottom={SPACING / 2} marginLeft={0}>
        <GridItemAutocomplete
          freeSolo
          label="Session"
          name={`${name}.session`}
          options={getAllSessions(students)}
          textFieldProps={{ required: true }}
        />
        <GridItemAutocomplete freeSolo label="Level" name={`${name}.level`} options={genderedLevels} />
        <GridItemTextField label="Attendance Percentage" name={`${name}.attendance`} />
        <GridItemAutocomplete
          freeSolo
          label="Level Audited"
          name={`${name}.levelAudited`}
          options={genderedLevels}
        />
      </GridContainer>
      <FormGrade gradePath={`${name}.finalResult`} label="Final Grade" />
      <FormGrade gradePath={`${name}.exitWritingExam`} label="Exit Writing Exam" />
      <FormGrade gradePath={`${name}.exitSpeakingExam`} label="Exit Speaking Exam" />
      <GridContainer marginBottom={0} marginLeft={0}>
        <GridItemTextField
          label="Teacher Comments"
          name={`${name}.comments`}
          textFieldProps={{ multiline: true, rows: 4 }}
        />
      </GridContainer>
    </>
  );
};
