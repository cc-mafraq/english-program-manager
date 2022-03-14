import { TypographyProps } from "@mui/material";
import { forOwn, map } from "lodash";
import React, { useContext } from "react";
import { LabeledContainer, LabeledText, ProgressBox } from ".";
import { AppContext, FinalResult, GenderedLevel, Grade, Student } from "../../interfaces";
import { getProgress, GREEN, RED } from "../../services";

interface AcademicRecordsProps {
  student: Student;
}

interface GradeInfoProps {
  grade?: Grade;
  label: string;
}

const labelProps: TypographyProps = { fontWeight: "normal", variant: "subtitle1" };

const GradeInfo: React.FC<GradeInfoProps> = ({ grade, label }) => {
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);

  const gradeContainerProps = (result?: FinalResult) => {
    return {
      sx: {
        backgroundColor: result === "P" ? GREEN : RED,
      },
    };
  };

  return (
    <LabeledContainer label={label} labelProps={labelProps}>
      <LabeledText
        condition={dataVisibility.academicRecords.result}
        containerProps={gradeContainerProps(grade?.result)}
        label="Result"
      >
        {grade ? FinalResult[grade.result] : undefined}
      </LabeledText>
      <LabeledText condition={dataVisibility.academicRecords.finalGrade} label="Percentage">
        {grade?.percentage !== undefined ? `${grade.percentage}%` : undefined}
      </LabeledText>
      <LabeledText condition={dataVisibility.academicRecords.finalGrade} label="Notes">
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

  return (
    <>
      <LabeledContainer
        condition={dataVisibility.academicRecords.progress}
        label="Progress"
        showWhenEmpty
      >
        {map(forOwn(progress), (v, k) => {
          return <ProgressBox key={k} level={k as GenderedLevel} sessionResults={v} />;
        })}
      </LabeledContainer>
      <LabeledContainer label="Academic Records" showWhenEmpty>
        {map(student.academicRecords, (ar, i) => {
          return (
            <LabeledContainer
              key={i}
              childContainerProps={{ marginTop: 0.5 }}
              label={`Session ${Number(i) + 1}`}
              labelProps={{ fontSize: 20, fontWeight: "normal" }}
              parentContainerProps={{
                border: 1,
                borderColor: "rgba(0,0,0,0.4)",
                marginBottom: 1,
                padding: 2,
                paddingTop: 1,
              }}
            >
              <LabeledContainer label="Record Information" labelProps={labelProps}>
                <LabeledText condition={dataVisibility.academicRecords.session} label="Session">
                  {ar.session}
                </LabeledText>
                <LabeledText condition={dataVisibility.academicRecords.level} label="Level">
                  {ar.level}
                </LabeledText>
                <LabeledText
                  condition={dataVisibility.academicRecords.levelAudited}
                  label="Level Audited"
                >
                  {ar.levelAudited}
                </LabeledText>
                <LabeledText
                  condition={dataVisibility.academicRecords.attendance}
                  label="Attendance"
                >
                  {ar.attendance !== undefined ? `${ar.attendance}%` : undefined}
                </LabeledText>
              </LabeledContainer>
              <GradeInfo grade={ar.finalResult} label="Final Grade" />
              <GradeInfo grade={ar.exitWritingExam} label="Exit Writing Exam" />
              <GradeInfo grade={ar.exitSpeakingExam} label="Exit Speaking Exam" />
              <LabeledContainer label="Teacher Comments" labelProps={labelProps}>
                <LabeledText
                  condition={dataVisibility.academicRecords.teacherComments}
                  label=""
                  textProps={{ fontSize: "11pt" }}
                >
                  {ar.comments}
                </LabeledText>
              </LabeledContainer>
            </LabeledContainer>
          );
        })}
        <LabeledText
          condition={dataVisibility.academicRecords.certificateRequests}
          label="Certificate Requests"
        >
          {student?.certificateRequests}
        </LabeledText>
      </LabeledContainer>
    </>
  );
};
