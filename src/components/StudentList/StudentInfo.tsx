import { Box } from "@mui/material";
import { camelCase, get, join, map, some, values } from "lodash";
import React, { useContext } from "react";
import { LabeledContainer, LabeledText } from "..";
import { useColors } from "../../hooks";
import { AppContext, Nationality, Status, Student } from "../../interfaces";
import { getRepeatNum, isActive } from "../../services";

interface StudentInfoProps {
  student: Student;
}

export const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);
  const { defaultBackgroundColor, green, red } = useColors();

  const allCheckboxesFalse = (label: string): boolean => {
    return some(values(get(dataVisibility, camelCase(label))));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <LabeledContainer condition={allCheckboxesFalse("Program Information")} label="Program Information">
        <LabeledText
          condition={dataVisibility.programInformation.inviteTag}
          containerProps={{
            sx: {
              backgroundColor: student.status.inviteTag ? green : red,
            },
          }}
          label="Invite"
        >
          {student.status.inviteTag ? "Yes" : "No"}
        </LabeledText>
        <LabeledText
          condition={dataVisibility.programInformation.noContactList}
          containerProps={{
            sx: {
              backgroundColor: student.status.noContactList ? red : defaultBackgroundColor,
            },
          }}
          label="NCL"
        >
          {student.status.noContactList ? "Yes" : undefined}
        </LabeledText>
        <LabeledText condition={dataVisibility.programInformation.currentLevel} label="Current Level">
          {student.currentLevel}
        </LabeledText>
        <LabeledText condition={dataVisibility.programInformation.status} label="Status">
          {Status[student.status.currentStatus]}
        </LabeledText>
        <LabeledText condition={dataVisibility.programInformation.active} label="Active">
          {isActive(student) ? "Yes" : "No"}
        </LabeledText>
        <LabeledText condition={dataVisibility.programInformation.initialSession} label="Initial Session">
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
      <LabeledContainer condition={allCheckboxesFalse("Demographics")} label="Demographics">
        <LabeledText condition={dataVisibility.demographics.nationality} label="Nationality">
          {Nationality[student.nationality]}
        </LabeledText>
        <LabeledText condition={dataVisibility.demographics.gender} label="Gender">
          {student.gender}
        </LabeledText>
        <LabeledText condition={dataVisibility.demographics.age} label="Age at Prog. Entry">
          {student.age}
        </LabeledText>
        <LabeledText condition={dataVisibility.demographics.occupation} label="Occupation">
          {student.work?.occupation}
        </LabeledText>
        <LabeledText condition={dataVisibility.demographics.lookingForJob} label="Looking For Job">
          {student.work?.lookingForJob}
        </LabeledText>
        <LabeledText condition={dataVisibility.demographics.teacher} label="Teacher">
          {student.work?.isTeacher ? "Yes" : undefined}
        </LabeledText>
        <LabeledText condition={dataVisibility.demographics.teachingSubjectArea} label="Teaching Subject Area">
          {student.work?.isTeacher ? student.work.teachingSubjectAreas : undefined}
        </LabeledText>
        <LabeledText condition={dataVisibility.demographics.englishTeacher} label="English Teacher">
          {student.work?.isEnglishTeacher ? "Yes" : undefined}
        </LabeledText>
        <LabeledText
          condition={dataVisibility.demographics.englishTeacherLocation}
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
        <LabeledText condition={dataVisibility.phoneNumbersAndWhatsApp.waBroadcastSar} label="WA Broadcast SAR">
          {student.phone.waBroadcastSAR}
        </LabeledText>
        <LabeledText
          condition={dataVisibility.phoneNumbersAndWhatsApp.waBroadcastOtherGroups}
          label="WA Broadcast Other Groups"
        >
          {join(student.phone.otherWaBroadcastGroups, ", ")}
        </LabeledText>
      </LabeledContainer>
      <LabeledContainer condition={allCheckboxesFalse("Placement")} label="Placement">
        <LabeledText condition={dataVisibility.placement.photoContact} label="Photo Contact">
          {student.placement.photoContact}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.placement} label="Placement">
          {student.placement.placement}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.classListSentDate} label="Class List Sent Date">
          {student.placement.classListSentDate}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.sectionsOffered} label="Sections Offered">
          {student.placement.sectionsOffered}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.placementConfirmed} label="Placement Confirmed">
          {student.placement.confDate}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.naClassSchedule} label="NA Class Schedule">
          {student.placement.noAnswerClassScheduleDate}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.pending} label="Pending">
          {student.placement.pending ? "Yes" : undefined}
        </LabeledText>
      </LabeledContainer>
      <LabeledContainer condition={dataVisibility.placement.originalPlacementData} label="Original Placement Data">
        <LabeledText label="Writing">{student.placement.origPlacementData.writing}</LabeledText>
        <LabeledText label="Speaking">{student.placement.origPlacementData.speaking}</LabeledText>
        <LabeledText label="Placement Level">{student.placement.origPlacementData.level}</LabeledText>
        <LabeledText label="Adjustment">{student.placement.origPlacementData.adjustment}</LabeledText>
      </LabeledContainer>
      <LabeledContainer condition={allCheckboxesFalse("Literacy")} label="Literacy">
        <LabeledText condition={dataVisibility.literacy.arabicLiteracy} label="Illiterate Arabic">
          {student.literacy?.illiterateAr ? "Yes" : undefined}
        </LabeledText>
        <LabeledText condition={dataVisibility.literacy.englishLiteracy} label="Illiterate English">
          {student.literacy?.illiterateEng ? "Yes" : undefined}
        </LabeledText>
        <LabeledText condition={dataVisibility.literacy.tutorAndDate} label="Tutor and Date">
          {student.literacy?.tutorAndDate}
        </LabeledText>
      </LabeledContainer>
      <LabeledContainer condition={dataVisibility.zoom.tutorAndDetails} label="Zoom">
        <LabeledText label="Tutor/Club and Details">{student.zoom}</LabeledText>
      </LabeledContainer>
    </Box>
  );
};
