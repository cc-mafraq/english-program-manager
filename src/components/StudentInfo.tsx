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
          <LabeledText label="Invite Tag">{student.status.inviteTag ? "Y" : "N"}</LabeledText>
          <LabeledText label="No Call List" textProps={{ color: "red" }}>
            {student.status.noCallList ? "NCL" : undefined}
          </LabeledText>
          <LabeledText label="Current Level">{student.currentLevel}</LabeledText>
          <LabeledText label="Status">{Status[student.status.currentStatus]}</LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Status">
          <LabeledText label="Audit">{student.status.audit ? "Y" : undefined}</LabeledText>
          <LabeledText label="Final GR Sent">{student.status.finalGradeSentDate}</LabeledText>
          <LabeledText label="Level Reveal Date">{student.status.levelRevealDate}</LabeledText>
          <LabeledText label="Reactivated Date">{student.status.reactivatedDate}</LabeledText>
          <LabeledText label="Withdraw Date">{join(student.status.withdrawDate, ", ")}</LabeledText>
          <LabeledText label="Repeat Number">{getRepeatNum(student)}</LabeledText>
          <LabeledText label="Sections Offered">{student.status.sectionsOffered}</LabeledText>
        </LabeledContainer>
        <LabeledContainer label="Demographics">
          <LabeledText label="Nationality">{Nationality[student.nationality]}</LabeledText>
          <LabeledText label="Gender">{student.gender}</LabeledText>
          <LabeledText label="Occupation">{student.work?.occupation}</LabeledText>
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
