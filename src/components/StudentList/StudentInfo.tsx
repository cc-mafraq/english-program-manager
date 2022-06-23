import { Box, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { camelCase, get, join, map, some, values } from "lodash";
import React, { useContext } from "react";
import { Image, LabeledContainer, LabeledText } from "..";
import { useColors } from "../../hooks";
import { AppContext, CovidStatus, Status, Student } from "../../interfaces";
import { covidVaccineImageFolder, getRepeatNum, isActive, JOIN_STR } from "../../services";

interface StudentInfoProps {
  student: Student;
}

export const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);
  const theme = useTheme();
  const { defaultBackgroundColor, green, red, yellow } = useColors();

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
        <LabeledText
          condition={dataVisibility.programInformation.familyCoordinatorEntry}
          label="Family Coordinator Entry"
        >
          {student.familyCoordinatorEntry}
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
      <Box>
        <LabeledContainer
          condition={allCheckboxesFalse("COVID Vaccine")}
          label="COVID Vaccine"
          parentContainerProps={{ marginRight: dataVisibility.covidVaccine.certificatePhoto ? 0 : "2vh" }}
        >
          <LabeledText
            condition={dataVisibility.covidVaccine.status}
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
          <LabeledText condition={dataVisibility.covidVaccine.date} label="Date">
            {student.covidVaccine?.date}
          </LabeledText>
          <LabeledText condition={dataVisibility.covidVaccine.reason} label="Reason">
            {student.covidVaccine?.reason}
          </LabeledText>
          <LabeledText
            condition={dataVisibility.covidVaccine.suspectedFraud}
            containerProps={{
              sx: {
                backgroundColor: student.covidVaccine?.suspectedFraud ? red : undefined,
              },
            }}
            label="Suspected Fraud"
          >
            {student.covidVaccine?.suspectedFraud ? "Yes" : undefined}
          </LabeledText>
          <LabeledText condition={dataVisibility.covidVaccine.suspectedFraudReason} label="Suspected Fraud Reason">
            {student.covidVaccine?.suspectedFraudReason}
          </LabeledText>
        </LabeledContainer>
        {dataVisibility.covidVaccine.certificatePhoto && (
          <Image
            folderName={covidVaccineImageFolder}
            imagePath="covidVaccine.imageName"
            imageStyleProps={{ maxHeight: "100px" }}
            innerContainerProps={{ maxHeight: "100px" }}
            noButton
            outerContainerProps={{ display: "inline-block", marginRight: "2vh" }}
            student={student}
          />
        )}
      </Box>
      <LabeledContainer condition={allCheckboxesFalse("Status")} label="Status">
        <LabeledText condition={dataVisibility.status.audit} label="Audit">
          {student.status.audit}
        </LabeledText>
        <LabeledText
          condition={dataVisibility.status.cheatingSessions}
          containerProps={{
            sx: {
              backgroundColor: student.status.cheatingSessions?.length ? red : defaultBackgroundColor,
            },
          }}
          label="Cheating Sessions"
        >
          {join(student.status.cheatingSessions, JOIN_STR)}
        </LabeledText>
        <LabeledText condition={dataVisibility.status.finalGrSent} label="Final GR Sent">
          {student.status.finalGradeSentDate}
        </LabeledText>
        <LabeledText condition={dataVisibility.status.levelReevalDate} label="Level Reeval Date">
          {student.status.levelReevalDate}
        </LabeledText>
        <LabeledText condition={dataVisibility.status.reactivatedDate} label="Reactivated Date">
          {join(student.status.reactivatedDate, JOIN_STR)}
        </LabeledText>
        <LabeledText condition={dataVisibility.status.withdrawDate} label="Withdraw Date">
          {join(student.status.withdrawDate, JOIN_STR)}
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
          {student.nationality}
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
        showWhenEmpty
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
          {join(student.phone.otherWaBroadcastGroups, JOIN_STR)}
        </LabeledText>
      </LabeledContainer>

      <LabeledContainer condition={dataVisibility.placement.originalPlacementData} label="Original Placement Data">
        <LabeledText label="Writing">{student.origPlacementData.writing}</LabeledText>
        <LabeledText label="Speaking">{student.origPlacementData.speaking}</LabeledText>
        <LabeledText label="Placement Level">{student.origPlacementData.level}</LabeledText>
        <LabeledText label="Adjustment">{student.origPlacementData.adjustment}</LabeledText>
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
