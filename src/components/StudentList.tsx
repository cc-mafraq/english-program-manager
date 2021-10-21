import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  TypographyProps,
} from "@mui/material";
import { map } from "lodash";
import React from "react";
import { LabeledText } from ".";
import { Nationality, SAMPLE_STUDENTS, Status } from "../interfaces";

const typographyLineProps: TypographyProps = {
  display: "inline",
  marginRight: "5%",
  variant: "body1",
};

export const StudentList = () => {
  return (
    <>
      {map(SAMPLE_STUDENTS, (student) => {
        return (
          <Card key={student.epId} sx={{ display: "flex", marginLeft: "5px" }}>
            <Box
              sx={{
                display: "flex",
                minWidth: "150px",
              }}
            >
              <CardMedia
                component="img"
                image={`./assets/${student.epId}.png`}
                sx={{ height: "35vh", minHeight: "200px" }}
              />
            </Box>
            <Box sx={{ flexGrow: 5, maxWidth: "85%" }}>
              <CardContent>
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
                  <LabeledText {...typographyLineProps} label="ID Number">
                    {student.epId}
                  </LabeledText>
                  <LabeledText {...typographyLineProps} label="Invite Tag">
                    {student.status.inviteTag ? "Y" : "N"}
                  </LabeledText>
                  <LabeledText {...typographyLineProps} label="Current Level">
                    {student.currentLevel}
                  </LabeledText>
                  <LabeledText {...typographyLineProps} label="Status">
                    {Status[student.status.currentStatus]}
                  </LabeledText>
                  <LabeledText {...typographyLineProps} label="Nationality">
                    {Nationality[student.nationality]}
                  </LabeledText>
                  <LabeledText {...typographyLineProps} label="Gender">
                    {student.gender}
                  </LabeledText>
                  <LabeledText {...typographyLineProps} label="Occupation">
                    {student.work.occupation}
                  </LabeledText>
                </Box>
                <LabeledText label="Correspondence" textProps={{ variant: "body2" }}>
                  {student.correspondence}
                </LabeledText>
              </CardContent>
            </Box>
            <CardActions
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "auto",
                marginTop: "auto",
                maxWidth: "5%",
              }}
            >
              <IconButton>
                <PersonIcon />
              </IconButton>
              <IconButton>
                <EditIcon />
              </IconButton>
            </CardActions>
          </Card>
        );
      })}
    </>
  );
};
