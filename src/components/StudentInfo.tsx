import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, IconButton, Typography } from "@mui/material";
import { camelCase, forOwn, get, map, some, values } from "lodash";
import React, { useContext } from "react";
import { LabeledContainer, LabeledText, ProgressBox } from ".";
import {
  AppContext,
  FinalResult,
  GenderedLevel,
  Nationality,
  Status,
  Student,
} from "../interfaces";
import { getProgress, getRepeatNum, isActive } from "../services";

export const StudentInfo = ({ student }: { student: Student }) => {
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);
  const progress = getProgress(student);

  const allCheckboxesFalse = (label: string): boolean => {
    return some(values(get(dataVisibility, camelCase(label))));
  };

  return (
    <>
      <Typography component="div" display="inline" gutterBottom variant="h5">
        {student.name.english} {student.name.arabic}
      </Typography>
      <Box sx={{ flexDirection: "row", flexGrow: 1, float: "right" }}>
        <Typography display="inline" marginRight="5px" variant="h5">
          {student.phone.primaryPhone}
        </Typography>
        <IconButton href={`https://wa.me/962${student.phone.primaryPhone}`} target="_blank">
          <WhatsAppIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", marginBottom: "1%", marginTop: "1%" }}>
        <LabeledContainer
          condition={allCheckboxesFalse("Program Information")}
          label="Program Information"
        >
          <LabeledText condition={dataVisibility.programInformation.idNumber} label="ID Number">
            {student.epId}
          </LabeledText>
          <LabeledText condition={dataVisibility.programInformation.inviteTag} label="Invite Tag">
            {student.status.inviteTag ? "Yes" : "No"}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.programInformation.noContactList}
            label="No Contact List"
            textProps={{ color: "red" }}
          >
            {student.status.noContactList ? "NCL" : undefined}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.programInformation.currentLevel}
            label="Current Level"
          >
            {student.currentLevel}
          </LabeledText>
          <LabeledText condition={dataVisibility.programInformation.status} label="Status">
            {Status[student.status.currentStatus]}
          </LabeledText>
          <LabeledText condition={dataVisibility.programInformation.active} label="Active">
            {isActive(student) ? "Yes" : "No"}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.programInformation.initialSession}
            label="Initial Session"
          >
            {student.initialSession}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer condition={allCheckboxesFalse("Status")} label="Status">
          <LabeledText condition={dataVisibility.status.audit} label="Audit">
            {student.status.audit ? "Yes" : undefined}
          </LabeledText>
          <LabeledText condition={dataVisibility.status.finalGrSent} label="Final GR Sent">
            {student.status.finalGradeSentDate}
          </LabeledText>
          <LabeledText condition={dataVisibility.status.levelReevalDate} label="Level Reeval Date">
            {student.status.levelReevalDate}
          </LabeledText>
          <LabeledText condition={dataVisibility.status.reactivatedDate} label="Reactivated Date">
            {student.status.reactivatedDate}
          </LabeledText>
          <LabeledText condition={dataVisibility.status.withdrawDate} label="Withdraw Date">
            {student.status.withdrawDate}
          </LabeledText>
          <LabeledText condition={dataVisibility.status.withdrawReason} label="Withdraw Reason">
            {student.status.droppedOutReason}
          </LabeledText>
          <LabeledText condition={dataVisibility.status.repeatNumber} label="Repeat Number">
            {getRepeatNum(student)}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer
          condition={allCheckboxesFalse("Student Information")}
          label="Student Information"
        >
          <LabeledText
            condition={dataVisibility.studentInformation.nationality}
            label="Nationality"
          >
            {Nationality[student.nationality]}
          </LabeledText>
          <LabeledText condition={dataVisibility.studentInformation.gender} label="Gender">
            {student.gender}
          </LabeledText>
          <LabeledText condition={dataVisibility.studentInformation.age} label="Age at Prog. Entry">
            {student.age}
          </LabeledText>
          <LabeledText condition={dataVisibility.studentInformation.occupation} label="Occupation">
            {student.work?.occupation}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.studentInformation.lookingForJob}
            label="Looking For Job"
          >
            {student.work?.lookingForJob}
          </LabeledText>
          <LabeledText condition={dataVisibility.studentInformation.teacher} label="Teacher">
            {student.work?.isTeacher ? "Yes" : undefined}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.studentInformation.teachingSubjectArea}
            label="Teaching Subject Area"
          >
            {student.work?.isTeacher ? student.work.teachingSubjectAreas : undefined}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.studentInformation.englishTeacher}
            label="English Teacher"
          >
            {student.work?.isEnglishTeacher ? "Yes" : undefined}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.studentInformation.englishTeacherLocation}
            label="English Teacher Location"
          >
            {student.work?.isEnglishTeacher ? student.work.englishTeacherLocation : undefined}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer
          condition={allCheckboxesFalse("Phone Numbers and WhatsApp")}
          label="Phone Numbers and WhatsApp"
        >
          {map(student.phone.phoneNumbers, (pn, i) => {
            return (
              <span key={i}>
                <LabeledText
                  condition={dataVisibility.phoneNumbersAndWhatsApp.phoneNumbers}
                  label={`Number ${Number(i) + 1}`}
                >
                  {pn.number}
                </LabeledText>
                <LabeledText
                  condition={dataVisibility.phoneNumbersAndWhatsApp.phoneNumbers}
                  label={`Number ${Number(i) + 1} Notes`}
                >
                  {pn.notes}
                </LabeledText>
              </span>
            );
          })}
          <LabeledText
            condition={dataVisibility.phoneNumbersAndWhatsApp.waBroadcastSar}
            label="WA Broadcast SAR"
          >
            {student.phone.waBroadcastSAR}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.phoneNumbersAndWhatsApp.waBroadcastOtherGroups}
            label="WA Broadcast Other Groups"
          >
            {student.phone.otherWaBroadcastGroups}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer condition={allCheckboxesFalse("Placement")} label="Placement">
          <LabeledText condition={dataVisibility.placement.photoContact} label="Photo Contact">
            {student.placement.photoContact}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.placement.sectionsOffered}
            label="Sections Offered"
          >
            {student.placement.sectionsOffered}
          </LabeledText>
          <LabeledText condition={dataVisibility.placement.placement} label="Placement">
            {student.placement.placement}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.placement.placementConfirmed}
            label="Placement Confirmed"
          >
            {student.placement.confDate}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.placement.naClassSchedule}
            label="NA Class Schedule"
          >
            {student.placement.noAnswerClassScheduleDate}
          </LabeledText>
          <LabeledText condition={dataVisibility.placement.pending} label="Pending">
            {student.placement.pending ? "Yes" : undefined}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer
          condition={dataVisibility.placement.originalPlacementData}
          label="Original Placement Data"
        >
          <LabeledText label="Writing">{student.placement.origPlacementData.writing}</LabeledText>
          <LabeledText label="Speaking">{student.placement.origPlacementData.speaking}</LabeledText>
          <LabeledText label="Placement Level">
            {student.placement.origPlacementData.level}
          </LabeledText>
          <LabeledText label="Adjustment">
            {student.placement.origPlacementData.adjustment}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer condition={allCheckboxesFalse("Class List")} label="Class List">
          <LabeledText condition={dataVisibility.classList.sent} label="Sent">
            {student.classList?.classListSent ? "Yes" : "No"}
          </LabeledText>
          <LabeledText condition={dataVisibility.classList.sentDate} label="Sent Date">
            {student.classList?.classListSentDate}
          </LabeledText>
          <LabeledText condition={dataVisibility.classList.notes} label="Notes">
            {student.classList?.classListSentNotes}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer condition={allCheckboxesFalse("Literacy")} label="Literacy">
          <LabeledText condition={dataVisibility.literacy.arabicLiteracy} label="Illiterate Arabic">
            {student.literacy?.illiterateAr ? "Yes" : undefined}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.literacy.englishLiteracy}
            label="Illiterate English"
          >
            {student.literacy?.illiterateEng ? "Yes" : undefined}
          </LabeledText>
          <LabeledText condition={dataVisibility.literacy.tutorAndDate} label="Tutor and Date">
            {student.literacy?.tutorAndDate}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer condition={dataVisibility.zoom.tutorAndDetails} label="Zoom">
          <LabeledText label="Tutor/Club and Details">{student.zoom}</LabeledText>
        </LabeledContainer>
        <LabeledContainer
          condition={dataVisibility.programInformation.correspondence}
          label="Correspondence"
        >
          {map(student.correspondence, (c) => {
            return (
              <Box key={`${c.date} ${c.notes}`} sx={{ paddingBottom: 1, paddingRight: 2 }}>
                <Typography fontSize="11pt" variant="body2">
                  {c.date ? `${c.date}: ${c.notes}` : c.notes}
                </Typography>
              </Box>
            );
          })}
        </LabeledContainer>
        <LabeledContainer
          condition={allCheckboxesFalse("Academic Records")}
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
                <LabeledText
                  condition={dataVisibility.academicRecords.attendance}
                  label="Attendance"
                >
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
        <LabeledContainer
          condition={dataVisibility.academicRecords.progress}
          label="Progress"
          showWhenEmpty
        >
          {map(forOwn(progress), (v, k) => {
            return <ProgressBox key={k} level={k as GenderedLevel} sessionResults={v} />;
          })}
        </LabeledContainer>
      </Box>
    </>
  );
};
