import { Box, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { join, map } from "lodash";
import React, { useContext, useMemo } from "react";
import { Image, LabeledContainer, LabeledText } from "..";
import { useColors } from "../../hooks";
import { AppContext, CovidStatus, Status, Student } from "../../interfaces";
import { covidVaccineImageFolder, getRepeatNum, getStatusDetails, isActive, JOIN_STR } from "../../services";

interface StudentInfoProps {
  student: Student;
}

export const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  const {
    appState: { students, role },
  } = useContext(AppContext);
  const theme = useTheme();
  const { defaultBackgroundColor, green, red, yellow } = useColors();
  const statusDetailsAndNumSessions = useMemo(() => {
    return getStatusDetails({ student, students });
  }, [student, students]);

  const active = useMemo(() => {
    return isActive(student) ? "Yes" : "No";
  }, [student]);

  const repeatNum = useMemo(() => {
    return getRepeatNum(student);
  }, [student]);
  const isAdminOrFaculty = role === "admin" || role === "faculty";

  const ProgramInformation = useMemo(() => {
    return (
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
        <LabeledText label="Active">{active}</LabeledText>
        <LabeledText label="Initial Session">{student.initialSession}</LabeledText>
      </LabeledContainer>
    );
  }, [
    active,
    defaultBackgroundColor,
    green,
    red,
    student.currentLevel,
    student.familyCoordinatorEntry,
    student.initialSession,
    student.status.currentStatus,
    student.status.inviteTag,
    student.status.noContactList,
  ]);

  const CovidVaccine = useMemo(() => {
    return (
      <Box hidden={role !== "admin"}>
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
          imageStyleProps={{ height: "100px", maxWidth: "150px" }}
          innerContainerProps={{ height: "100px", marginLeft: "-10%", top: "17px" }}
          loadingContainerProps={{ marginLeft: "30px", marginTop: "30px", transform: "none" }}
          outerContainerProps={{ display: "inline-block", height: "100px", marginRight: "2vh", width: "150px" }}
          scale={1.5}
          student={student}
        />
      </Box>
    );
  }, [
    green,
    red,
    role,
    student,
    theme.palette.mode,
    theme.palette.text.primary,
    theme.palette.text.secondary,
    yellow,
  ]);

  const StatusBox = useMemo(() => {
    return (
      <LabeledContainer label="Status">
        <LabeledText condition={isAdminOrFaculty} label="Status Details">
          {statusDetailsAndNumSessions[0]}
        </LabeledText>
        <LabeledText label="Sessions Attended">
          {statusDetailsAndNumSessions[1]} session{statusDetailsAndNumSessions[1] === 1 ? "" : "s"}
        </LabeledText>
        <LabeledText condition={isAdminOrFaculty} label="Audit">
          {student.status.audit}
        </LabeledText>
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
        <LabeledText condition={isAdminOrFaculty} label="Final GR Sent">
          {student.status.finalGradeSentDate}
        </LabeledText>
        <LabeledText condition={isAdminOrFaculty} label="Level Reeval Date">
          {student.status.levelReevalDate}
        </LabeledText>
        <LabeledText condition={isAdminOrFaculty} label="Reactivated Date">
          {join(student.status.reactivatedDate, JOIN_STR)}
        </LabeledText>
        <LabeledText condition={isAdminOrFaculty} label="Withdraw Date">
          {join(student.status.withdrawDate, JOIN_STR)}
        </LabeledText>
        <LabeledText condition={isAdminOrFaculty} label="Withdraw Reason">
          {student.status.droppedOutReason}
        </LabeledText>
        <LabeledText condition={isAdminOrFaculty} label="Repeat Number">
          {repeatNum}
        </LabeledText>
      </LabeledContainer>
    );
  }, [
    defaultBackgroundColor,
    isAdminOrFaculty,
    red,
    repeatNum,
    statusDetailsAndNumSessions,
    student.status.audit,
    student.status.cheatingSessions,
    student.status.droppedOutReason,
    student.status.finalGradeSentDate,
    student.status.levelReevalDate,
    student.status.reactivatedDate,
    student.status.withdrawDate,
  ]);

  const Demographics = useMemo(() => {
    return (
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
    );
  }, [
    student.age,
    student.gender,
    student.nationality,
    student.work.englishTeacherLocation,
    student.work?.isEnglishTeacher,
    student.work?.isTeacher,
    student.work?.lookingForJob,
    student.work?.occupation,
    student.work.teachingSubjectAreas,
  ]);

  const PhoneNumbers = useMemo(() => {
    return (
      <LabeledContainer label="Phone Numbers and WhatsApp" showWhenEmpty>
        {map(student.phone.phoneNumbers, (pn, i) => {
          return (
            <span key={i}>
              <LabeledText label={`Number ${Number(i) + 1}`}>{pn.number}</LabeledText>
              <LabeledText condition={isAdminOrFaculty} label={`Number ${Number(i) + 1} Notes`}>
                {pn.notes}
              </LabeledText>
            </span>
          );
        })}
        <Box hidden={!isAdminOrFaculty}>
          <LabeledText label="WA Broadcast SAR">{student.phone.waBroadcastSAR}</LabeledText>
          <LabeledText label="WA Broadcast Other Groups">
            {join(student.phone.otherWaBroadcastGroups, JOIN_STR)}
          </LabeledText>
        </Box>
      </LabeledContainer>
    );
  }, [
    isAdminOrFaculty,
    student.phone.otherWaBroadcastGroups,
    student.phone.phoneNumbers,
    student.phone.waBroadcastSAR,
  ]);

  const PlacementData = useMemo(() => {
    return (
      <LabeledContainer condition={isAdminOrFaculty} label="Original Placement Data">
        <LabeledText label="Writing">{student.origPlacementData.writing}</LabeledText>
        <LabeledText label="Speaking">{student.origPlacementData.speaking}</LabeledText>
        <LabeledText label="Placement Level">{student.origPlacementData.level}</LabeledText>
        <LabeledText label="Adjustment">{student.origPlacementData.adjustment}</LabeledText>
      </LabeledContainer>
    );
  }, [
    isAdminOrFaculty,
    student.origPlacementData.adjustment,
    student.origPlacementData.level,
    student.origPlacementData.speaking,
    student.origPlacementData.writing,
  ]);
  const LiteracyAndZoom = useMemo(() => {
    return (
      <>
        <LabeledContainer label="Literacy">
          <LabeledText label="Illiterate Arabic">{student.literacy?.illiterateAr ? "Yes" : undefined}</LabeledText>
          <LabeledText label="Illiterate English">
            {student.literacy?.illiterateEng ? "Yes" : undefined}
          </LabeledText>
          <LabeledText label="Tutor and Date">{student.literacy?.tutorAndDate}</LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Zoom">
          <LabeledText label="Tutor/Club and Details">{student.zoom}</LabeledText>
        </LabeledContainer>
      </>
    );
  }, [
    student.literacy?.illiterateAr,
    student.literacy?.illiterateEng,
    student.literacy?.tutorAndDate,
    student.zoom,
  ]);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {ProgramInformation}
      {CovidVaccine}
      {StatusBox}
      {Demographics}
      {PhoneNumbers}
      {PlacementData}
      {LiteracyAndZoom}
    </Box>
  );
};
