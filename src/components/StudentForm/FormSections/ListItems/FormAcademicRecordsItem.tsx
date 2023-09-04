import { Close } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";
import {
  FormGrade,
  FormLabel,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
} from "../../..";
import { useAppStore, useColors, useStudentStore } from "../../../../hooks";
import { genderedLevels } from "../../../../interfaces";
import { FormItem, SPACING, getAllSessions } from "../../../../services";

export const FormAcademicRecordsItem: React.FC<FormItem & { title?: string }> = ({
  index,
  removeItem,
  name,
  title,
}) => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const role = useAppStore((state) => {
    return state.role;
  });

  const { iconColor } = useColors();

  return (
    <>
      <Grid container marginLeft={SPACING}>
        <FormLabel textProps={{ marginTop: SPACING }}>
          {role === "admin" ? `Session ${index === undefined ? "" : Number(index) + 1}` : title ?? ""}
        </FormLabel>
        {removeItem && (
          <Tooltip arrow title="Remove Session">
            <IconButton
              onClick={removeItem(index)}
              sx={{ color: iconColor, marginTop: "1.5vh", position: "absolute", right: "1.5vh" }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
      <GridContainer marginBottom={SPACING / 2} marginLeft={0}>
        <>
          <GridItemAutocomplete
            freeSolo
            gridProps={{ hidden: role !== "admin" }}
            label="Session"
            name={name ? `${name}.session` : "session"}
            options={getAllSessions(students)}
            textFieldProps={{ required: true }}
          />
          <GridItemAutocomplete
            autoHighlight={false}
            freeSolo
            gridProps={{ hidden: role !== "admin" }}
            label="Level"
            name={name ? `${name}.level` : "level"}
            options={genderedLevels}
          />
          <GridItemAutocomplete
            autoHighlight={false}
            freeSolo
            gridProps={{ hidden: role !== "admin" }}
            label="Level Audited"
            name={name ? `${name}.levelAudited` : "levelAudited"}
            options={genderedLevels}
          />
          <GridItemTextField
            gridProps={{ hidden: role !== "admin" }}
            label="Attendance Percentage"
            name={name ? `${name}.attendance` : "attendance"}
          />
        </>
      </GridContainer>
      <FormGrade
        directGradePath
        gradePath={name ? `${name}.overallResult` : "overallResult"}
        label="Overall Result"
        noNotes={role !== "admin"}
        notesLabel="FGR Notes"
        notesPath={name ? `${name}.finalGradeReportNotes` : "finalGradeReportNotes"}
        percentageComponent={
          role === "admin" ? (
            <GridItemDatePicker
              gridProps={{ sm: 3 }}
              label="Final Grade Report Sent"
              name={name ? `${name}.finalGradeSentDate` : "finalGradeSentDate"}
            />
          ) : (
            <GridItemTextField
              gridProps={{ sm: 3 }}
              label="Attendance Percentage"
              name={name ? `${name}.attendance` : "attendance"}
            />
          )
        }
      />
      <FormGrade gradePath={name ? `${name}.finalGrade` : "finalGrade"} label="Class Grade" />
      <FormGrade gradePath={name ? `${name}.exitWritingExam` : "exitWritingExam"} label="Exit Writing Exam" />
      <FormGrade gradePath={name ? `${name}.exitSpeakingExam` : "exitSpeakingExam"} label="Exit Speaking Exam" />
      <GridContainer marginBottom={0} marginLeft={0}>
        <GridItemTextField
          label="Teacher Comments"
          name={name ? `${name}.comments` : "comments"}
          textFieldProps={{ multiline: true, rows: 4 }}
        />
      </GridContainer>
    </>
  );
};

FormAcademicRecordsItem.defaultProps = {
  title: undefined,
};
