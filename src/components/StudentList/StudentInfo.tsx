import { Box, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { join, map } from "lodash";
import React, { useContext } from "react";
import { Image, LabeledContainer, LabeledText } from "..";
import { useColors } from "../../hooks";
import { AppContext, CovidStatus, Status, Student } from "../../interfaces";
import { covidVaccineImageFolder, getRepeatNum, getStatusDetails, isActive, JOIN_STR } from "../../services";

interface StudentInfoProps {
  student: Student;
}

export const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  const {
    appState: { students },
  } = useContext(AppContext);
  const theme = useTheme();
  const { defaultBackgroundColor, green, red, yellow } = useColors();
  const statusDetailsAndNumSessions = getStatusDetails({ student, students });

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <LabeledContainer label="Program Information">
        <LabeledText
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
          containerProps={{
            sx: {
              backgroundColor: student.status.noContactList ? red : defaultBackgroundColor,
            },
          }}
          label="NCL"
        >
          {student.status.noContactList ? "Yes" : undefined}
        </LabeledText>
        <LabeledText label="Current Level">{student.currentLevel}</LabeledText>
        <LabeledText label="Family Coordinator Entry">{student.familyCoordinatorEntry}</LabeledText>
        <LabeledText label="Status">{Status[student.status.currentStatus]}</LabeledText>
        <LabeledText label="Active">{isActive(student) ? "Yes" : "No"}</LabeledText>
        <LabeledText label="Initial Session">{student.initialSession}</LabeledText>
      </LabeledContainer>
      <Box>
        <LabeledContainer label="COVID Vaccine" parentContainerProps={{ marginRight: "2vh" }}>
          <LabeledText
            containerProps={{
              sx: {
                backgroundColor:
                  student.covidVaccine?.status === CovidStatus.FULL ||
                  student.covidVaccine?.status === CovidStatus.EXEMPT ||
                  student.covidVaccine?.status === CovidStatus.BOOST
                    ? green
                    : student.covidVaccine?.status === CovidStatus.PART
                    ? yellow
                    : red,
              },
            }}
            label="Status"
            labelProps={{
              color:
                theme.palette.mode === "dark" && student.covidVaccine?.status === CovidStatus.PART
                  ? grey[800]
                  : theme.palette.text.secondary,
            }}
            textProps={{
              color:
                theme.palette.mode === "dark" && student.covidVaccine?.status === CovidStatus.PART
                  ? grey[900]
                  : theme.palette.text.primary,
            }}
          >
            {student.covidVaccine?.status}
          </LabeledText>
          <LabeledText label="Date">{student.covidVaccine?.date}</LabeledText>
          <LabeledText label="Reason">{student.covidVaccine?.reason}</LabeledText>
          <LabeledText
            containerProps={{
              sx: {
                backgroundColor: student.covidVaccine?.suspectedFraud ? red : undefined,
              },
            }}
            label="Suspected Fraud"
          >
            {student.covidVaccine?.suspectedFraud ? "Yes" : undefined}
          </LabeledText>
          <LabeledText label="Suspected Fraud Reason">{student.covidVaccine?.suspectedFraudReason}</LabeledText>
        </LabeledContainer>
        <Image
          folderName={covidVaccineImageFolder}
          imagePath="covidVaccine.imageName"
          imageStyleProps={{ height: "100px" }}
          innerContainerProps={{ height: "100px" }}
          loadingContainerProps={{ marginLeft: "30px", marginTop: "30px", transform: "none" }}
          noButton
          outerContainerProps={{ display: "inline-block", marginRight: "2vh" }}
          student={student}
        />
      </Box>
      <LabeledContainer label="Status">
        <LabeledText label="Status Details">{statusDetailsAndNumSessions[0]}</LabeledText>
        <LabeledText label="Sessions Attended">
          {statusDetailsAndNumSessions[1]} session{statusDetailsAndNumSessions[1] === 1 ? "" : "s"}
        </LabeledText>
        <LabeledText label="Audit">{student.status.audit}</LabeledText>
        <LabeledText
          containerProps={{
            sx: {
              backgroundColor: student.status.cheatingSessions?.length ? red : defaultBackgroundColor,
            },
          }}
          label="Cheating Sessions"
        >
          {join(student.status.cheatingSessions, JOIN_STR)}
        </LabeledText>
        <LabeledText label="Final GR Sent">{student.status.finalGradeSentDate}</LabeledText>
        <LabeledText label="Level Reeval Date">{student.status.levelReevalDate}</LabeledText>
        <LabeledText label="Reactivated Date">{join(student.status.reactivatedDate, JOIN_STR)}</LabeledText>
        <LabeledText label="Withdraw Date">{join(student.status.withdrawDate, JOIN_STR)}</LabeledText>
        <LabeledText label="Withdraw Reason">{student.status.droppedOutReason}</LabeledText>
        <LabeledText label="Repeat Number">{getRepeatNum(student)}</LabeledText>
      </LabeledContainer>
      <LabeledContainer label="Demographics">
        <LabeledText label="Nationality">{student.nationality}</LabeledText>
        <LabeledText label="Gender">{student.gender}</LabeledText>
        <LabeledText label="Age at Prog. Entry">{student.age}</LabeledText>
        <LabeledText label="Occupation">{student.work?.occupation}</LabeledText>
        <LabeledText label="Looking For Job">{student.work?.lookingForJob}</LabeledText>
        <LabeledText label="Teacher">{student.work?.isTeacher ? "Yes" : undefined}</LabeledText>
        <LabeledText label="Teaching Subject Area">
          {student.work?.isTeacher ? student.work.teachingSubjectAreas : undefined}
        </LabeledText>
        <LabeledText label="English Teacher">{student.work?.isEnglishTeacher ? "Yes" : undefined}</LabeledText>
        <LabeledText label="English Teacher Location">
          {student.work?.isEnglishTeacher ? student.work.englishTeacherLocation : undefined}
        </LabeledText>
      </LabeledContainer>
      <LabeledContainer label="Phone Numbers and WhatsApp" showWhenEmpty>
        {map(student.phone.phoneNumbers, (pn, i) => {
          return (
            <span key={i}>
              <LabeledText label={`Number ${Number(i) + 1}`}>{pn.number}</LabeledText>
              <LabeledText label={`Number ${Number(i) + 1} Notes`}>{pn.notes}</LabeledText>
            </span>
          );
        })}
        <LabeledText label="WA Broadcast SAR">{student.phone.waBroadcastSAR}</LabeledText>
        <LabeledText label="WA Broadcast Other Groups">
          {join(student.phone.otherWaBroadcastGroups, JOIN_STR)}
        </LabeledText>
      </LabeledContainer>

      <LabeledContainer label="Original Placement Data">
        <LabeledText label="Writing">{student.origPlacementData.writing}</LabeledText>
        <LabeledText label="Speaking">{student.origPlacementData.speaking}</LabeledText>
        <LabeledText label="Placement Level">{student.origPlacementData.level}</LabeledText>
        <LabeledText label="Adjustment">{student.origPlacementData.adjustment}</LabeledText>
      </LabeledContainer>
      <LabeledContainer label="Literacy">
        <LabeledText label="Illiterate Arabic">{student.literacy?.illiterateAr ? "Yes" : undefined}</LabeledText>
        <LabeledText label="Illiterate English">{student.literacy?.illiterateEng ? "Yes" : undefined}</LabeledText>
        <LabeledText label="Tutor and Date">{student.literacy?.tutorAndDate}</LabeledText>
      </LabeledContainer>
      <LabeledContainer label="Zoom">
        <LabeledText label="Tutor/Club and Details">{student.zoom}</LabeledText>
      </LabeledContainer>
    </Box>
  );
};
