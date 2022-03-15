import CloseIcon from "@mui/icons-material/Close";
import { Grid, IconButton } from "@mui/material";
import React from "react";
import { FormGrade, GridContainer, GridItemAutocomplete, GridItemTextField, StudentFormLabel } from "../../..";
import { useColors } from "../../../../hooks";
import { genderedLevels, Student } from "../../../../interfaces";
import { FormItem, getAllSessions, SPACING } from "../../../../services";

export const FormAcademicRecordsItem: React.FC<FormItem & { students: Student[] }> = ({
  index,
  removeItem,
  students,
}) => {
  const recordName = `academicRecords[${index}]`;
  const { iconColor } = useColors();

  return (
    <>
      <Grid container marginLeft={SPACING}>
        <StudentFormLabel textProps={{ marginTop: SPACING }}>Academic Record {Number(index) + 1}</StudentFormLabel>
        <IconButton
          onClick={removeItem && removeItem(index)}
          sx={{ color: iconColor, marginLeft: SPACING / 2, top: "15%" }}
        >
          <CloseIcon />
        </IconButton>
      </Grid>
      <GridContainer marginBottom={SPACING / 2} marginLeft={0}>
        <GridItemAutocomplete
          freeSolo
          label="Session"
          name={`${recordName}.session`}
          options={getAllSessions(students)}
        />
        <GridItemAutocomplete freeSolo label="Level" name={`${recordName}.level`} options={genderedLevels} />
        <GridItemTextField label="Attendance Percentage" name={`${recordName}.attendance`} />
        <GridItemAutocomplete
          freeSolo
          label="Level Audited"
          name={`${recordName}.levelAudited`}
          options={genderedLevels}
        />
      </GridContainer>
      <FormGrade gradePath={`${recordName}.finalResult`} label="Final Grade" />
      <FormGrade gradePath={`${recordName}.exitWritingExam`} label="Exit Writing Exam" />
      <FormGrade gradePath={`${recordName}.exitSpeakingExam`} label="Exit Speaking Exam" />
      <GridContainer marginBottom={0} marginLeft={0}>
        <GridItemTextField
          label="Teacher Comments"
          name={`${recordName}.comments`}
          textFieldProps={{ multiline: true, rows: 4 }}
        />
      </GridContainer>
    </>
  );
};
