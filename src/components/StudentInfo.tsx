import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, IconButton, Typography } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { LabeledText } from ".";
import { Nationality, Status, Student } from "../interfaces";

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
      <Box sx={{ marginBottom: "1%", marginTop: "1%" }}>
        <LabeledText label="ID Number">{student.epId}</LabeledText>
        <LabeledText label="Invite Tag">{student.status.inviteTag ? "Y" : "N"}</LabeledText>
        <LabeledText label="No Call List" textProps={{ color: "red" }}>
          {student.status.noCallList ? "NCL" : undefined}
        </LabeledText>
        <LabeledText label="Current Level">{student.currentLevel}</LabeledText>
        <LabeledText label="Status">{Status[student.status.currentStatus]}</LabeledText>
        <LabeledText label="Nationality">{Nationality[student.nationality]}</LabeledText>
        <LabeledText label="Gender">{student.gender}</LabeledText>
        <LabeledText label="Occupation">{student.work?.occupation}</LabeledText>
        <LabeledText label="Correspondence" textProps={{ fontSize: "11pt", variant: "body2" }}>
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
