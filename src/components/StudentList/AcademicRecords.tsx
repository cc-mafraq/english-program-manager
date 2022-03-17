import { TypographyProps, useTheme } from "@mui/material";
import { forOwn, map, omit, some, values } from "lodash";
import React, { useContext } from "react";
import { LabeledContainer, LabeledText, ProgressBox } from ".";
import { useColors } from "../../hooks";
import { AppContext, FinalResult, GenderedLevel, Grade, Student } from "../../interfaces";
import { getProgress } from "../../services";

interface AcademicRecordsProps {
  student: Student;
}

interface GradeInfoProps {
  grade?: Grade;
  gradeVisibility: boolean;
  label: string;
}

const labelProps: TypographyProps = { fontWeight: "normal", variant: "subtitle1" };

const GradeInfo: React.FC<GradeInfoProps> = ({ grade, label, gradeVisibility }) => {
  const { green, red } = useColors();

  const gradeContainerProps = (result?: FinalResult) => {
    return {
      sx: {
        backgroundColor: result === "P" ? green : red,
      },
    };
  };

  return (
    <LabeledContainer condition={gradeVisibility} label={label} labelProps={labelProps}>
      <LabeledText condition={gradeVisibility} containerProps={gradeContainerProps(grade?.result)} label="Result">
        {grade?.result ? FinalResult[grade.result] : undefined}
      </LabeledText>
      <LabeledText condition={gradeVisibility} label="Percentage">
        {grade?.percentage !== undefined ? `${grade.percentage}%` : undefined}
      </LabeledText>
      <LabeledText condition={gradeVisibility} label="Notes">
        {grade?.notes}
      </LabeledText>
    </LabeledContainer>
  );
};

GradeInfo.defaultProps = {
  grade: undefined,
};

export const AcademicRecords: React.FC<AcademicRecordsProps> = ({ student }) => {
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);
  const progress = getProgress(student);
  const theme = useTheme();

  return (
    <>
      <LabeledContainer condition={dataVisibility.academicRecords.progress} label="Progress" showWhenEmpty>
        {map(forOwn(progress), (v, k) => {
          return <ProgressBox key={k} level={k as GenderedLevel} sessionResults={v} />;
        })}
      </LabeledContainer>
      <LabeledContainer
        condition={some(values(omit(dataVisibility.academicRecords, "progress")))}
        label="Academic Records"
        showWhenEmpty
      >
        {map(student.academicRecords, (ar, i) => {
          return (
            <LabeledContainer
              key={i}
              childContainerProps={{ marginTop: 0.5 }}
              condition={some([
                dataVisibility.academicRecords.attendance && ar.attendance,
                dataVisibility.academicRecords.level && ar.level,
                dataVisibility.academicRecords.levelAudited && ar.levelAudited,
                dataVisibility.academicRecords.session,
                dataVisibility.academicRecords.certificateRequests && student.certificateRequests,
                dataVisibility.academicRecords.exitSpeakingExam && ar.exitSpeakingExam,
                dataVisibility.academicRecords.exitWritingExam && ar.exitWritingExam,
                dataVisibility.academicRecords.teacherComments && ar.comments,
                dataVisibility.academicRecords.finalGrade && ar.finalResult,
              ])}
              label={`Session ${Number(i) + 1}`}
              labelProps={{ fontSize: 20, fontWeight: "normal" }}
              parentContainerProps={{
                border: 1,
                borderColor: theme.palette.mode === "light" ? "#999999" : "#666666",
                marginBottom: 1,
                padding: 2,
                paddingTop: 1,
              }}
            >
              <LabeledContainer
                condition={some([
                  dataVisibility.academicRecords.attendance && ar.attendance,
                  dataVisibility.academicRecords.level && ar.level,
                  dataVisibility.academicRecords.levelAudited && ar.levelAudited,
                  dataVisibility.academicRecords.session,
                ])}
                label="Record Information"
                labelProps={labelProps}
              >
                <LabeledText condition={dataVisibility.academicRecords.session} label="Session">
                  {ar.session}
                </LabeledText>
                <LabeledText condition={dataVisibility.academicRecords.level} label="Level">
                  {ar.level}
                </LabeledText>
                <LabeledText condition={dataVisibility.academicRecords.levelAudited} label="Level Audited">
                  {ar.levelAudited}
                </LabeledText>
                <LabeledText condition={dataVisibility.academicRecords.attendance} label="Attendance">
                  {ar.attendance !== undefined ? `${ar.attendance}%` : undefined}
                </LabeledText>
              </LabeledContainer>
              <GradeInfo
                grade={ar.finalResult}
                gradeVisibility={dataVisibility.academicRecords.finalGrade}
                label="Final Grade"
              />
              <GradeInfo
                grade={ar.exitWritingExam}
                gradeVisibility={dataVisibility.academicRecords.exitWritingExam}
                label="Exit Writing Exam"
              />
              <GradeInfo
                grade={ar.exitSpeakingExam}
                gradeVisibility={dataVisibility.academicRecords.exitSpeakingExam}
                label="Exit Speaking Exam"
              />
              <LabeledContainer
                condition={dataVisibility.academicRecords.teacherComments}
                label="Teacher Comments"
                labelProps={labelProps}
              >
                <LabeledText label="" textProps={{ fontSize: "11pt" }}>
                  {ar.comments}
                </LabeledText>
              </LabeledContainer>
            </LabeledContainer>
          );
        })}
        <LabeledText condition={dataVisibility.academicRecords.certificateRequests} label="Certificate Requests">
          {student?.certificateRequests}
        </LabeledText>
      </LabeledContainer>
    </>
  );
};
