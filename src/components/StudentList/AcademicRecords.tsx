import { forOwn, map } from "lodash";
import React, { useContext } from "react";
import { LabeledContainer, LabeledText, ProgressBox } from ".";
import { AppContext, FinalResult, GenderedLevel, Student } from "../../interfaces";
import { getProgress } from "../../services";

interface AcademicRecordsProps {
  student: Student;
}

export const AcademicRecords: React.FC<AcademicRecordsProps> = ({ student }) => {
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);
  const progress = getProgress(student);

  return (
    <>
      <LabeledContainer
        condition={dataVisibility.academicRecords.progress}
        containerProps={{ display: "block" }}
        label="Progress"
        showWhenEmpty
      >
        {map(forOwn(progress), (v, k) => {
          return <ProgressBox key={k} level={k as GenderedLevel} sessionResults={v} />;
        })}
      </LabeledContainer>
      <LabeledContainer
        containerProps={{ display: "block" }}
        label="Academic Records"
        showWhenEmpty
      >
        {map(student.academicRecords, (ar, i) => {
          return (
            <LabeledContainer
              key={i}
              label={`Session ${Number(i) + 1}`}
              labelProps={{ fontWeight: "normal" }}
            >
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
              <LabeledText condition={dataVisibility.academicRecords.result} label="Result">
                {ar.finalResult ? FinalResult[ar.finalResult?.result] : undefined}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.finalGrade}
                label="Final Grade"
              >
                {ar.finalResult?.percentage !== undefined
                  ? `${ar.finalResult?.percentage}%`
                  : undefined}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.finalGrade}
                label="Final Grade Notes"
              >
                {ar.finalResult?.notes}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.exitWritingExam}
                label="Exit Writing Exam"
              >
                {ar.exitWritingExam ? FinalResult[ar.exitWritingExam?.result] : undefined}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.exitWritingExam}
                label="Exit Writing %"
              >
                {ar.exitWritingExam?.percentage !== undefined
                  ? `${ar.exitWritingExam?.percentage}%`
                  : undefined}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.exitWritingExam}
                label="Exit Writing Exam Notes"
              >
                {ar.exitWritingExam?.notes}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.exitSpeakingExam}
                label="Exit Speaking Exam"
              >
                {ar.exitSpeakingExam ? FinalResult[ar.exitSpeakingExam?.result] : undefined}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.exitSpeakingExam}
                label="Exit Speaking Exam %"
              >
                {ar.exitSpeakingExam?.percentage !== undefined
                  ? `${ar.exitSpeakingExam?.percentage}%`
                  : undefined}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.exitSpeakingExam}
                label="Exit Speaking Exam Notes"
              >
                {ar.exitSpeakingExam?.notes}
              </LabeledText>
              <LabeledText condition={dataVisibility.academicRecords.attendance} label="Attendance">
                {ar.attendance !== undefined ? `${ar.attendance}%` : undefined}
              </LabeledText>
              <LabeledText
                condition={dataVisibility.academicRecords.teacherComments}
                label="Teacher Comments"
                textProps={{ fontSize: "11pt" }}
              >
                {ar.comments}
              </LabeledText>
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
