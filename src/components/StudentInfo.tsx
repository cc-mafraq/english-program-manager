import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, IconButton, Typography } from "@mui/material";
import { join, map } from "lodash";
import React from "react";
import { LabeledContainer, LabeledText } from ".";
import { Nationality, Status, Student } from "../interfaces";
import { getRepeatNum } from "../services";

export const StudentInfo = ({ student }: { student: Student }) => {
  return (
    <>
      <Typography component="div" display="inline" gutterBottom variant="h5">
        {student.name.english} {student.name.arabic}
      </Typography>
      <Box sx={{ flexDirection: "row", flexGrow: 1, float: "right" }}>
        <Typography display="inline" marginRight="5px" variant="h5">
          {student.phone.phoneNumbers[student.phone.primaryPhone].number}
        </Typography>
        {student.phone.hasWhatsapp ? (
          <IconButton
            href={`https://wa.me/962${
              student.phone.phoneNumbers[student.phone.primaryPhone].number
            }`}
            target="_blank"
          >
            <WhatsAppIcon />
          </IconButton>
        ) : (
          <></>
        )}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", marginBottom: "1%", marginTop: "1%" }}>
        <LabeledContainer label="Program Information">
          <LabeledText label="ID Number">{student.epId}</LabeledText>
          <LabeledText label="Invite Tag">{student.status.inviteTag ? "Yes" : "No"}</LabeledText>
          <LabeledText label="No Call List" textProps={{ color: "red" }}>
            {student.status.noCallList ? "NCL" : undefined}
          </LabeledText>
          <LabeledText label="Current Level">{student.currentLevel}</LabeledText>
          <LabeledText label="Status">{Status[student.status.currentStatus]}</LabeledText>
          <LabeledText label="Initial Session">{student.initialSession}</LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Status">
          <LabeledText label="Audit">{student.status.audit ? "Yes" : undefined}</LabeledText>
          <LabeledText label="Final GR Sent">{student.status.finalGradeSentDate}</LabeledText>
          <LabeledText label="Level Reveal Date">{student.status.levelRevealDate}</LabeledText>
          <LabeledText label="Reactivated Date">
            {join(student.status.reactivatedDate, ", ")}
          </LabeledText>
          <LabeledText label="Withdraw Date">{join(student.status.withdrawDate, ", ")}</LabeledText>
          <LabeledText label="Withdraw Reason">{student.droppedOutReason}</LabeledText>
          <LabeledText label="Repeat Number">{getRepeatNum(student)}</LabeledText>
          <LabeledText label="Sections Offered">
            {join(student.status.sectionsOffered, ", ")}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Student Information">
          <LabeledText label="Nationality">{Nationality[student.nationality]}</LabeledText>
          <LabeledText label="Gender">{student.gender}</LabeledText>
          <LabeledText label="Age at Prog. Entry">{student.age}</LabeledText>
          <LabeledText label="Occupation">{student.work?.occupation}</LabeledText>
          <LabeledText label="Looking For Job">{student.work?.lookingForJob}</LabeledText>
          <LabeledText label="Teacher">{student.work?.teacher ? "Yes" : undefined}</LabeledText>
          <LabeledText label="Teaching Subject Area">
            {student.work?.teacher ? student.work.teachingSubjectAreas : undefined}
          </LabeledText>
          <LabeledText label="English Teacher">
            {student.work?.englishTeacher ? "Yes" : undefined}
          </LabeledText>
          <LabeledText label="English Teacher Location">
            {student.work?.englishTeacher ? student.work.englishTeacherLocation : undefined}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Phone Numbers and Whatsapp">
          {map(student.phone.phoneNumbers, (pn, i) => {
            return (
              <>
                <LabeledText label={`Number ${i + 1}`}>{pn.number}</LabeledText>
                <LabeledText label={`Number ${i + 1} Notes`}>{pn.notes}</LabeledText>
              </>
            );
          })}
          <LabeledText label="WA Notes">{student.phone.whatsappNotes}</LabeledText>
          <LabeledText label="WA Broadcast SAR">{student.phone.waBroadcastSAR}</LabeledText>
          <LabeledText label="WA Broadcast SAR">
            {join(student.phone.otherWaBroadcastGroups, ", ")}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Placement">
          <LabeledText label="Photo Contact">
            {join(student.placement.photoContact, ", ")}
          </LabeledText>
          <LabeledText label="Placement">{join(student.placement.placement, ", ")}</LabeledText>
          <LabeledText label="Notified">{student.placement.notified ? "Yes" : "No"}</LabeledText>
          <LabeledText label="Placement Confirmed">
            {join(student.placement.confDate, ", ")}
          </LabeledText>
          <LabeledText label="NA Class Schedule">
            {student.placement.noAnswerClassScheduleDate}
          </LabeledText>
          <LabeledText label="Pending">{student.placement.pending ? "Yes" : undefined}</LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Original Placement Data">
          <LabeledText label="Writing">{student.placement.origPlacementData.writing}</LabeledText>
          <LabeledText label="Speaking">{student.placement.origPlacementData.speaking}</LabeledText>
          <LabeledText label="Placement Level">
            {student.placement.origPlacementData.level}
          </LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Class List">
          <LabeledText label="Sent">{student.classList?.classListSent ? "Yes" : "No"}</LabeledText>
          <LabeledText label="Sent Date">{student.classList?.classListSentDate}</LabeledText>
          <LabeledText label="Notes">{student.classList?.classListSentNotes}</LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Literacy">
          <LabeledText label="Illiterate Arabic">
            {student.literacy?.illiterateAr ? "Yes" : undefined}
          </LabeledText>
          <LabeledText label="Illiterate English">
            {student.literacy?.illiterateEng ? "Yes" : undefined}
          </LabeledText>
          <LabeledText label="Tutor and Date">{student.literacy?.tutorAndDate}</LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Zoom">
          <LabeledText label="Tutor/Club and Details">{student.zoom}</LabeledText>
        </LabeledContainer>
        <LabeledText
          label="Correspondence"
          labelProps={{ fontSize: "medium", fontWeight: "bold" }}
          textProps={{ fontSize: "11pt", variant: "body2" }}
        >
          {map(student.correspondence, (c) => {
            return (
              <div>
                {c.date}: {c.notes}
              </div>
            );
          })}
        </LabeledText>
        <LabeledText label="Certificate Requests">{student?.certificateRequests}</LabeledText>
      </Box>
    </>
  );
};
