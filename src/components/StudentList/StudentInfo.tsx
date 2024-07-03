import { FileOpen } from "@mui/icons-material";
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { join, map } from "lodash";
import React, { useMemo } from "react";
import { Image, LabeledContainer, LabeledText } from "..";
import { useAppStore, useColors, useStudentStore } from "../../hooks";
import { Status, Student } from "../../interfaces";
import { JOIN_STR, covidVaccineImageFolder, getRepeatNum, getStatusDetails, isActive } from "../../services";

interface StudentInfoProps {
  data: Student;
}

const ProgramInformation: React.FC<StudentInfoProps> = ({ data: student }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";
  const { defaultBackgroundColor, green, red } = useColors();

  const active = useMemo(() => {
    return student.status?.currentStatus === undefined ? undefined : isActive(student) ? "Yes" : "No";
  }, [student]);

  return (
    <LabeledContainer label="Program Information">
      <LabeledText
        containerProps={{
          sx: {
            backgroundColor: student.status?.inviteTag ? green : red,
          },
        }}
        label="Invite"
      >
        {student.status?.inviteTag === undefined ? undefined : student.status?.inviteTag ? "Yes" : "No"}
      </LabeledText>
      <LabeledText
        containerProps={{
          sx: {
            backgroundColor: student.status?.noContactList ? red : defaultBackgroundColor,
          },
        }}
        label="NCL"
      >
        {student.status?.noContactList ? "Yes" : undefined}
      </LabeledText>
      <LabeledText label="Current Level">{student.currentLevel}</LabeledText>
      <LabeledText condition={isAdminOrFaculty} label="Family Coordinator Entry">
        {student.familyCoordinatorEntry}
      </LabeledText>
      {student.status?.currentStatus && (
        <LabeledText label="Status">{Status[student.status.currentStatus]}</LabeledText>
      )}
      <LabeledText label="Active">{active}</LabeledText>
      <LabeledText label="Initial Session">{student.initialSession}</LabeledText>
    </LabeledContainer>
  );
};

const StatusBox: React.FC<StudentInfoProps> = ({ data: student }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";
  const students = useStudentStore((state) => {
    return state.students;
  });
  const { defaultBackgroundColor, red } = useColors();
  const statusDetailsAndNumSessions = useMemo(() => {
    return getStatusDetails({ student, students });
  }, [student, students]);

  const repeatNum = useMemo(() => {
    return getRepeatNum(student);
  }, [student]);

  return (
    <LabeledContainer label="Status">
      <LabeledText condition={isAdminOrFaculty} label="Status Details">
        {statusDetailsAndNumSessions[0]}
      </LabeledText>
      <LabeledText label="Sessions Attended">
        {statusDetailsAndNumSessions[1]} session{statusDetailsAndNumSessions[1] === 1 ? "" : "s"}
      </LabeledText>
      <LabeledText
        containerProps={{
          sx: {
            backgroundColor: student.status?.cheatingSessions?.length ? red : defaultBackgroundColor,
          },
        }}
        label="Cheating Sessions"
      >
        {join(student.status?.cheatingSessions, JOIN_STR)}
      </LabeledText>
      <LabeledText condition={isAdminOrFaculty} label="Level Reeval Date">
        {student.status?.levelReevalDate}
      </LabeledText>
      <LabeledText condition={isAdminOrFaculty} label="Reactivated Date">
        {join(student.status?.reactivatedDate, JOIN_STR)}
      </LabeledText>
      <LabeledText condition={isAdminOrFaculty} label="Withdraw Date">
        {join(student.status?.withdrawDate, JOIN_STR)}
      </LabeledText>
      <LabeledText condition={isAdminOrFaculty} label="Withdraw Reason">
        {student.status?.droppedOutReason}
      </LabeledText>
      <LabeledText condition={isAdminOrFaculty} label="Repeat">
        {repeatNum}
      </LabeledText>
      <LabeledText label="ID Card in Box">{student.status?.idCardInBox ? "Yes" : undefined}</LabeledText>
    </LabeledContainer>
  );
};

const Demographics: React.FC<StudentInfoProps> = ({ data: student }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";

  return (
    <LabeledContainer label="Demographics">
      <LabeledText label="Nationality">{student.nationality}</LabeledText>
      <LabeledText label={import.meta.env.VITE_PROJECT_NAME === "kallaline-tunis" ? "Ville" : "City"}>
        {student.city}
      </LabeledText>
      <LabeledText label="Gender">
        {student.gender === "M" ? "Male" : student.gender === "F" ? "Female" : undefined}
      </LabeledText>
      <LabeledText label="Age at Prog. Entry">{student.age}</LabeledText>
      <LabeledText label="Occupation">{student.work?.occupation}</LabeledText>
      <LabeledText condition={isAdminOrFaculty} label="Looking For Job">
        {student.work?.lookingForJob}
      </LabeledText>
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
};

export const PhoneNumbers: React.FC<StudentInfoProps & { noWhatsapp?: boolean }> = ({
  data: student,
  noWhatsapp,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";

  return (
    <LabeledContainer label={noWhatsapp ? "Phone Numbers" : "Phone Numbers and WhatsApp"} showWhenEmpty>
      {map(student.phone?.phoneNumbers, (pn, i) => {
        return (
          <span key={i}>
            <LabeledText label={`Number ${Number(i) + 1}`}>{pn.number}</LabeledText>
            <LabeledText condition={isAdminOrFaculty && !noWhatsapp} label={`Number ${Number(i) + 1} Notes`}>
              {pn.notes}
            </LabeledText>
          </span>
        );
      })}
      <Box hidden={role !== "admin" || noWhatsapp}>
        <LabeledText label="WA Broadcast SAR">{student.phone?.waBroadcastSAR}</LabeledText>
        <LabeledText label="WA Broadcast Other Groups">
          {join(student.phone?.otherWaBroadcastGroups, JOIN_STR)}
        </LabeledText>
      </Box>
    </LabeledContainer>
  );
};

const PlacementData: React.FC<StudentInfoProps> = ({ data: student }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";
  return (
    <LabeledContainer condition={isAdminOrFaculty} label="Original Placement Data">
      <LabeledText label="Writing">{student.origPlacementData?.writing}</LabeledText>
      <LabeledText label="Speaking">{student.origPlacementData?.speaking}</LabeledText>
      <LabeledText label="Placement Level">{student.origPlacementData?.level}</LabeledText>
      <LabeledText label="Adjustment">{student.origPlacementData?.adjustment}</LabeledText>
      <Box sx={{ justifyContent: "center", marginLeft: "1vw", paddingTop: "10px" }}>
        {student.origPlacementData?.examFile ? (
          <Tooltip title="Open Placement Exam">
            <IconButton href={student.origPlacementData.examFile} target="_blank">
              <FileOpen fontSize="large" />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}
      </Box>
    </LabeledContainer>
  );
};

const CovidVaccine: React.FC<StudentInfoProps> = ({ data: student }) => {
  const role = useAppStore((state) => {
    return state.role;
  });

  return (
    <Box hidden={role !== "admin"}>
      <LabeledContainer label="COVID Vaccine" parentContainerProps={{ marginRight: "2vh" }}>
        <LabeledText label="Status">{student.covidVaccine?.status}</LabeledText>
        <LabeledText label="Date">{student.covidVaccine?.date}</LabeledText>
        <LabeledText label="Reason">{student.covidVaccine?.reason}</LabeledText>
        <LabeledText label="Suspected Fraud">
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
};

const LiteracyAndZoom: React.FC<StudentInfoProps> = ({ data: student }) => {
  return (
    <>
      <LabeledContainer label="Literacy">
        <LabeledText label="Illiterate Arabic">{student.literacy?.illiterateAr ? "Yes" : undefined}</LabeledText>
        <LabeledText label="Illiterate English">{student.literacy?.illiterateEng ? "Yes" : undefined}</LabeledText>
        <LabeledText label="Tutor and Date">{student.literacy?.tutorAndDate}</LabeledText>
      </LabeledContainer>
      <LabeledContainer label="Zoom">
        <LabeledText label="Tutor/Club and Details">{student.zoom}</LabeledText>
      </LabeledContainer>
    </>
  );
};

const PersonalInformation: React.FC<StudentInfoProps> = ({ data: student }) => {
  return (
    <LabeledContainer label="Personal Information">
      <LabeledText
        label={import.meta.env.VITE_PROJECT_NAME === "kallaline-tunis" ? "CIN Number" : "National ID Number"}
      >
        {student.nationalID}
      </LabeledText>
      <LabeledText label="Email">{student.email}</LabeledText>
    </LabeledContainer>
  );
};

export const StudentInfo: React.FC<StudentInfoProps> = ({ data: student }) => {
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box sx={greaterThanSmall ? { display: "flex", flexWrap: "wrap" } : undefined}>
      <ProgramInformation data={student} />
      {student.phone && <PhoneNumbers data={student} />}
      {student.status && <StatusBox data={student} />}
      <PersonalInformation data={student} />
      <Demographics data={student} />
      {student.origPlacementData && <PlacementData data={student} />}
      {student.covidVaccine && <CovidVaccine data={student} />}
      <LiteracyAndZoom data={student} />
    </Box>
  );
};

PhoneNumbers.defaultProps = {
  noWhatsapp: undefined,
};
