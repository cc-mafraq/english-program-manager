import CloseIcon from "@mui/icons-material/Close";
import { Grid, IconButton } from "@mui/material";
import React from "react";
import { GridItemAutocomplete, GridItemRadioGroup, GridItemTextField, StudentFormLabel } from ".";
import { genderedLevels, PF, results, Student } from "../interfaces";
import { FormItem, getAllSessions, SPACING } from "../services";

export const FormAcademicRecordItem: React.FC<FormItem & { students: Student[] }> = ({
  index,
  removeItem,
  students,
}) => {
  const recordName = `academicRecords[${index}]`;
  return (
    <Grid key={recordName} container>
      <StudentFormLabel textProps={{ marginLeft: SPACING, marginTop: SPACING }}>
        Academic Record {Number(index) + 1}
      </StudentFormLabel>
      <IconButton
        onClick={removeItem && removeItem(index)}
        sx={{ height: "12%", marginLeft: SPACING, top: "5%" }}
      >
        <CloseIcon />
      </IconButton>
      <Grid key={recordName} container>
        <Grid item xs>
          <GridItemAutocomplete
            freeSolo
            gridProps={{ padding: SPACING }}
            label="Session"
            name={`${recordName}.session`}
            options={getAllSessions(students)}
          />
          <GridItemAutocomplete
            freeSolo
            gridProps={{ padding: SPACING, paddingTop: 0 }}
            label="Level"
            name={`${recordName}.level`}
            options={genderedLevels}
          />
          <GridItemTextField
            gridProps={{ padding: SPACING, paddingTop: 0 }}
            label="Attendance Percentage"
            name={`${recordName}.attendance`}
          />
        </Grid>
        <Grid item xs>
          <GridItemRadioGroup
            label="Result"
            name={`${recordName}.finalResult.result`}
            options={results}
          />
          <GridItemTextField
            gridProps={{ padding: SPACING, paddingLeft: 0 }}
            label="Final Grades"
            name={`${recordName}.finalResult.percentage`}
          />
          <GridItemTextField
            gridProps={{ paddingRight: SPACING }}
            label="Final Grades Notes"
            name={`${recordName}.finalResult.notes`}
          />
        </Grid>
        <Grid item xs>
          <GridItemRadioGroup
            label="Writing Exit Exam Result"
            name={`${recordName}.exitWritingExam.result`}
            options={PF}
          />
          <GridItemTextField
            gridProps={{ padding: SPACING, paddingLeft: 0 }}
            label="Writing Exit Exam Percentage"
            name={`${recordName}.exitWritingExam.percentage`}
          />
          <GridItemTextField
            gridProps={{ paddingRight: SPACING }}
            label="Writing Exit Exam Notes"
            name={`${recordName}.exitWritingExam.notes`}
          />
        </Grid>
        <Grid item xs>
          <GridItemRadioGroup
            label="Speaking Exit Exam Result"
            name={`${recordName}.exitSpeakingExam.result`}
            options={PF}
          />
          <GridItemTextField
            gridProps={{ padding: SPACING, paddingLeft: 0 }}
            label="Speaking Exit Exam Percentage"
            name={`${recordName}.exitSpeakingExam.percentage`}
          />
          <GridItemTextField
            gridProps={{ paddingRight: SPACING }}
            label="Speaking Exit Exam Notes"
            name={`${recordName}.exitSpeakingExam.notes`}
          />
        </Grid>
        <Grid item xs>
          <GridItemAutocomplete
            freeSolo
            gridProps={{ padding: SPACING }}
            label="Level Audited"
            name={`${recordName}.levelAudited`}
            options={genderedLevels}
          />
          <GridItemTextField
            gridProps={{ padding: SPACING, paddingTop: 0 }}
            label="Elective Class Attended"
            name={`${recordName}.electiveClass`}
          />
        </Grid>
        <Grid item xs>
          <GridItemTextField
            gridProps={{ padding: SPACING, paddingLeft: 0 }}
            label="Teacher Comments"
            name={`${recordName}.comments`}
            textFieldProps={{ multiline: true, rows: 7 }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
