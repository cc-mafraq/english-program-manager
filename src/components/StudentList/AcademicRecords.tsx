import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography, TypographyProps, useTheme } from "@mui/material";
import { green as materialGreen, red as materialRed } from "@mui/material/colors";
import { findIndex, forOwn, map, reverse } from "lodash";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FormAcademicRecordsItem, FormDialog, LabeledContainer, LabeledText, ProgressBox } from "..";
import { useColors } from "../../hooks";
import {
  AcademicRecord,
  AppContext,
  emptyAcademicRecord,
  FinalResult,
  GenderedLevel,
  Grade,
  Student,
} from "../../interfaces";
import {
  academicRecordsSchema,
  getAllSessions,
  getProgress,
  removeNullFromObject,
  setData,
  SPACING,
  StudentProgress,
} from "../../services";

interface AcademicRecordsProps {
  data: Student;
}

interface GradeInfoProps {
  grade?: Grade;
  label: string;
}

const labelProps: TypographyProps = { fontWeight: "normal", variant: "subtitle1" };

const GradeInfo: React.FC<GradeInfoProps> = ({ grade, label }) => {
  const { green, red } = useColors();

  const gradeContainerProps = (result?: FinalResult) => {
    return {
      sx: {
        backgroundColor: result === "P" ? green : red,
      },
    };
  };

  return (
    <LabeledContainer label={label} labelProps={labelProps}>
      <LabeledText containerProps={gradeContainerProps(grade?.result)} label="Result">
        {grade?.result ? FinalResult[grade.result] : undefined}
      </LabeledText>
      <LabeledText label="Percentage">
        {grade?.percentage !== undefined ? `${grade.percentage}%` : undefined}
      </LabeledText>
      <LabeledText label="Notes">{grade?.notes}</LabeledText>
    </LabeledContainer>
  );
};

GradeInfo.defaultProps = {
  grade: undefined,
};

export const AcademicRecords: React.FC<AcademicRecordsProps> = ({ data: student }) => {
  const {
    appState: { students, role },
  } = useContext(AppContext);
  const [progress, setProgress] = useState<StudentProgress>({});
  const theme = useTheme();
  const { iconColor } = useColors();
  const [open, setOpen] = useState(false);
  const [selectedAcademicRecord, setSelectedAcademicRecord] = useState<AcademicRecord | null>(null);
  const { red, green } = useColors();

  useEffect(() => {
    setProgress(getProgress(student, getAllSessions(students)));
  }, [student, students]);

  const handleDialogOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
    setSelectedAcademicRecord(null);
  }, []);

  const handleEditClick = useCallback(
    (index: number) => {
      return () => {
        setSelectedAcademicRecord(student.academicRecords[index]);
        handleDialogOpen();
      };
    },
    [handleDialogOpen, student.academicRecords],
  );

  const onSubmit = useCallback(
    (data: AcademicRecord) => {
      const dataNoNull = removeNullFromObject(data) as AcademicRecord;
      if (selectedAcademicRecord) {
        const recordIndex = findIndex(student.academicRecords, selectedAcademicRecord);
        student.academicRecords[recordIndex] = dataNoNull;
      } else {
        student.academicRecords.push(dataNoNull);
      }
      setData(student, "students", "epId");
      handleDialogClose();
    },
    [handleDialogClose, selectedAcademicRecord, student],
  );

  const PB = useMemo(() => {
    return map(forOwn(progress), (v, k) => {
      return <ProgressBox key={k} level={k as GenderedLevel} sessionResults={v} />;
    });
  }, [progress]);

  const RecordData = useMemo(() => {
    return reverse(
      map(student.academicRecords, (ar, i) => {
        return (
          <LabeledContainer
            key={i}
            childContainerProps={{ marginTop: 0.5 }}
            label={`Session ${Number(i) + 1}`}
            labelProps={{ fontSize: 20, fontWeight: "normal" }}
            parentContainerProps={{
              border: 1,
              borderColor: theme.palette.mode === "light" ? "#999999" : "#666666",
              marginBottom: 1,
              padding: 2,
              paddingTop: 1,
              position: "relative",
              width: "100%",
            }}
          >
            {ar.finalResult?.result && (
              <Box
                sx={{
                  left: "35%",
                  position: "absolute",
                  top: "1vh",
                }}
              >
                <Typography color="text.secondary" display="inline" fontSize="large">
                  Level Pass/Fail:{" "}
                </Typography>
                <Typography
                  color={
                    ar.finalResult.result === FinalResult.P
                      ? theme.palette.mode === "light"
                        ? materialGreen[600]
                        : green
                      : theme.palette.mode === "light"
                      ? materialRed[600]
                      : red
                  }
                  display="inline"
                  fontSize={20}
                  fontWeight="bold"
                >
                  {ar.finalResult.result}
                </Typography>
              </Box>
            )}
            {role === "admin" && (
              <Tooltip arrow title="Edit Academic Record">
                <IconButton
                  onClick={handleEditClick(i)}
                  sx={{
                    color: iconColor,
                    position: "absolute",
                    right: "1.5vh",
                    top: "1.5vh",
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            <LabeledContainer label="Record Information" labelProps={labelProps}>
              <LabeledText label="Session">{ar.session}</LabeledText>
              <LabeledText label="Level">{ar.level}</LabeledText>
              <LabeledText label="Level Audited">{ar.levelAudited}</LabeledText>
              <LabeledText label="Attendance">
                {ar.attendance !== undefined ? `${ar.attendance}%` : undefined}
              </LabeledText>
            </LabeledContainer>
            <GradeInfo
              grade={{
                ...ar.finalResult,
                result: ar.finalResult
                  ? (ar.finalResult?.percentage || 0) >= 80
                    ? FinalResult.P
                    : (ar.finalResult?.percentage || 0) > 0
                    ? FinalResult.F
                    : FinalResult.WD
                  : undefined,
              }}
              label="Class Grade"
            />
            <GradeInfo grade={ar.exitWritingExam} label="Exit Writing Exam" />
            <GradeInfo grade={ar.exitSpeakingExam} label="Exit Speaking Exam" />
            <LabeledContainer label="Teacher Comments" labelProps={labelProps}>
              <LabeledText label="" textProps={{ fontSize: "11pt" }}>
                {ar.comments}
              </LabeledText>
            </LabeledContainer>
          </LabeledContainer>
        );
      }),
    );
  }, [green, handleEditClick, iconColor, red, role, student.academicRecords, theme.palette.mode]);

  return (
    <>
      <LabeledContainer label="Progress" parentContainerProps={{ height: "90px", width: "100%" }} showWhenEmpty>
        {PB}
      </LabeledContainer>
      <LabeledContainer label="Academic Records" showWhenEmpty>
        {role === "admin" && (
          <Box marginBottom={1} marginTop={1}>
            <Button color="secondary" onClick={handleDialogOpen} variant="contained">
              Add Session
            </Button>
          </Box>
        )}
        {RecordData}
        <LabeledText label="Certificate Requests">{student?.certificateRequests}</LabeledText>
      </LabeledContainer>
      <FormDialog
        dialogProps={{ maxWidth: "lg" }}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        useFormProps={{
          defaultValues: selectedAcademicRecord || emptyAcademicRecord,
          resolver: yupResolver(academicRecordsSchema),
        }}
      >
        <Box paddingRight={SPACING * 2}>
          <FormAcademicRecordsItem />
        </Box>
      </FormDialog>
    </>
  );
};
