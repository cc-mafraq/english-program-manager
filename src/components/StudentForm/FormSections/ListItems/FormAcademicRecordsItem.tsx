import { Close } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { includes, parseInt } from "lodash";
import React, { ChangeEvent, useCallback } from "react";
import { useFormContext } from "react-hook-form";
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
import { FormItem, SPACING, getAllSessions, isElective } from "../../../../services";

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

  const { watch, setValue, getValues } = useFormContext();
  const level =
    getValues(name ? `${name}.level` : "level") || getValues(name ? `${name}.levelAudited` : "levelAudited");
  const [attendancePercentage, classPercentage, writingPercentage, speakingPercentage] = watch([
    name ? `${name}.attendance` : "attendance",
    name ? `${name}.finalGrade.percentage` : "finalGrade.percentage",
    name ? `${name}.exitWritingExam.percentage` : "exitWritingExam.percentage",
    name ? `${name}.exitSpeakingExam.percentage` : "exitSpeakingExam.percentage",
  ]);

  const updateOverallResult = useCallback(
    (caller: string) => {
      return (e: ChangeEvent<HTMLInputElement>) => {
        const newPercentage = parseInt(e.target.value);
        const newAttendancePercentage = includes(caller, "attendance") ? newPercentage : attendancePercentage;
        const newClassPercentage = includes(caller, "finalGrade") ? newPercentage : classPercentage;
        const newWritingPercentage = includes(caller, "exitWritingExam") ? newPercentage : writingPercentage;
        const newSpeakingPercentage = includes(caller, "exitSpeakingExam") ? newPercentage : speakingPercentage;
        if (newAttendancePercentage !== "" && newAttendancePercentage < 50) {
          setValue(name ? `${name}.overallResult` : "overallResult", "WD");
        } else if (
          newAttendancePercentage >= 70 &&
          newClassPercentage >= 80 &&
          ((newWritingPercentage >= 80 && newSpeakingPercentage >= 80) || isElective(level))
        ) {
          setValue(name ? `${name}.overallResult` : "overallResult", "P");
        } else if (newAttendancePercentage && newClassPercentage) {
          setValue(name ? `${name}.overallResult` : "overallResult", "F");
        } else {
          setValue(name ? `${name}.overallResult` : "overallResult", null);
        }
      };
    },
    [attendancePercentage, classPercentage, level, name, setValue, speakingPercentage, writingPercentage],
  );

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
            textFieldProps={{ onChange: updateOverallResult("attendance") }}
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
              gridProps={{ sm: 4.75 }}
              label="Attendance Percentage"
              name={name ? `${name}.attendance` : "attendance"}
              textFieldProps={{ onChange: updateOverallResult("attendance") }}
            />
          )
        }
      />
      <FormGrade
        gradePath={name ? `${name}.finalGrade` : "finalGrade"}
        label="Class Grade"
        noNotes={role !== "admin"}
        onPercentageChange={updateOverallResult("finalGrade")}
      />
      <FormGrade
        gradePath={name ? `${name}.exitWritingExam` : "exitWritingExam"}
        label="Exit Writing Exam"
        noNotes={role !== "admin"}
        onPercentageChange={updateOverallResult("exitWritingExam")}
      />
      <FormGrade
        gradePath={name ? `${name}.exitSpeakingExam` : "exitSpeakingExam"}
        label="Exit Speaking Exam"
        noNotes={role !== "admin"}
        onPercentageChange={updateOverallResult("exitSpeakingExam")}
      />
      <GridContainer marginBottom={0} marginLeft={0}>
        <GridItemTextField
          gridProps={role !== "admin" ? { sm: 12 } : undefined}
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
