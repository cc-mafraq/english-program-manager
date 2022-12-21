import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowForwardIos, Edit } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breakpoint,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  TypographyProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { green as materialGreen, red as materialRed } from "@mui/material/colors";
import { findIndex, forOwn, includes, map, reverse, without } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { FormAcademicRecordsItem, FormDialog, LabeledContainer, LabeledText, ProgressBox } from "..";
import { useAppStore, useColors, useStudentStore } from "../../hooks";
import { AcademicRecord, emptyAcademicRecord, FinalResult, GenderedLevel, Grade, Student } from "../../interfaces";
import {
  academicRecordsSchema,
  getAllSessions,
  getProgress,
  removeNullFromObject,
  setData,
  SPACING,
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

const FormAcademicRecordsMemo = React.memo(() => {
  return (
    <Box paddingRight={SPACING * 2}>
      <FormAcademicRecordsItem />
    </Box>
  );
});
FormAcademicRecordsMemo.displayName = "Academic Records Form";

export const AcademicRecords: React.FC<AcademicRecordsProps> = ({ data: student }) => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const progress = useMemo(() => {
    return getProgress(student, getAllSessions(students));
  }, [student, students]);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([student.academicRecords.length - 1]);
  const [selectedAcademicRecord, setSelectedAcademicRecord] = useState<AcademicRecord | null>(null);
  const { red, green } = useColors();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

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

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { maxWidth: breakpoint };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: selectedAcademicRecord || emptyAcademicRecord,
      resolver: yupResolver(academicRecordsSchema),
    };
  }, [selectedAcademicRecord]);

  const PB = useMemo(() => {
    return map(forOwn(progress), (v, k) => {
      return <ProgressBox key={k} level={k as GenderedLevel} sessionResults={v} />;
    });
  }, [progress]);

  const handleAccordionChange = useCallback(
    (recordIndex: number) => {
      return (event: React.SyntheticEvent, newExpanded: boolean) => {
        newExpanded ? setExpanded([...expanded, recordIndex]) : setExpanded(without(expanded, recordIndex));
      };
    },
    [expanded],
  );

  const RecordData = useMemo(() => {
    return reverse(
      map(student.academicRecords, (ar, i) => {
        return (
          <Accordion
            key={i}
            expanded={includes(expanded, i)}
            onChange={handleAccordionChange(i)}
            sx={{
              "& .MuiCollapse-wrapperInner": {
                paddingBottom: "10px",
              },
              width: "100%",
            }}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary
              expandIcon={<ArrowForwardIos sx={{ fontSize: "0.9rem" }} />}
              sx={{
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  transform: "rotate(90deg)",
                },
                flexDirection: "row-reverse",
              }}
            >
              <Typography sx={{ marginLeft: "10vw", width: "20vw" }} variant="h6">
                {ar.session}
              </Typography>
              {ar.level && (
                <Typography sx={{ width: "20vw" }} variant="h6">
                  {ar.level}
                </Typography>
              )}
              {ar.levelAudited && (
                <Typography sx={{ width: "20vw" }} variant="h6">
                  {ar.levelAudited} Audit
                </Typography>
              )}
              {ar.overallResult && (
                <Typography
                  color={
                    ar.overallResult === FinalResult.P
                      ? theme.palette.mode === "light"
                        ? materialGreen[600]
                        : green
                      : theme.palette.mode === "light"
                      ? materialRed[600]
                      : red
                  }
                  sx={{ fontWeight: "bold", width: "20vw" }}
                  variant="h6"
                >
                  {ar.overallResult}
                </Typography>
              )}
              {role === "admin" && (
                <Tooltip arrow title="Edit Academic Record">
                  <IconButton onClick={handleEditClick(i)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
            </AccordionSummary>
            <Divider />
            <AccordionDetails sx={{}}>
              <GradeInfo grade={ar.finalGrade} label="Class Grade" />
              <GradeInfo grade={ar.exitWritingExam} label="Exit Writing Exam" />
              <GradeInfo grade={ar.exitSpeakingExam} label="Exit Speaking Exam" />
              <LabeledContainer label="Attendance" labelProps={labelProps}>
                <LabeledText label="">{ar.attendance !== undefined ? `${ar.attendance}%` : undefined}</LabeledText>
              </LabeledContainer>
              <LabeledContainer label="Teacher Comments" labelProps={labelProps}>
                <LabeledText label="" textProps={{ fontSize: "11pt" }}>
                  {ar.comments}
                </LabeledText>
              </LabeledContainer>
              <LabeledContainer label="Final Grade Report Sent" labelProps={labelProps}>
                <LabeledText label="">{ar.finalGradeSentDate}</LabeledText>
              </LabeledContainer>
              <LabeledContainer label="Final Grade Report Notes" labelProps={labelProps}>
                <LabeledText label="">{ar.finalGradeReportNotes}</LabeledText>
              </LabeledContainer>
            </AccordionDetails>
          </Accordion>
        );
      }),
    );
  }, [
    expanded,
    green,
    handleAccordionChange,
    handleEditClick,
    red,
    role,
    student.academicRecords,
    theme.palette.mode,
  ]);

  return (
    <Box sx={greaterThanSmall ? { display: "flex", flexDirection: "column" } : undefined}>
      <LabeledContainer
        label="Progress"
        parentContainerProps={{ minHeight: "100px", width: "100%" }}
        showWhenEmpty
      >
        {PB}
      </LabeledContainer>
      <LabeledContainer label="Academic Records" showWhenEmpty>
        {role === "admin" && (
          <Box marginBottom={1} marginTop={1} width="100%">
            <Button color="secondary" onClick={handleDialogOpen} variant="contained">
              Add Session
            </Button>
          </Box>
        )}
        {RecordData}
        <LabeledText label="Certificate Requests">{student?.certificateRequests}</LabeledText>
      </LabeledContainer>
      <FormDialog<AcademicRecord>
        dialogProps={dialogProps}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        useFormProps={useFormProps}
      >
        <FormAcademicRecordsMemo />
      </FormDialog>
    </Box>
  );
};
