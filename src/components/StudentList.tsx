import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Card, CardActions, CardContent, IconButton, List, ListItem } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { StudentInfo } from ".";
import { Student } from "../interfaces";

export const StudentList = ({ studentsPage }: { studentsPage: Student[] }) => {
  return (
    <List>
      {map(studentsPage, (student) => {
        return (
          <ListItem key={student.epId}>
            <Card sx={{ display: "flex", marginLeft: "5px", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  minWidth: "150px",
                }}
              >
                {/* <CardMedia
                component="img"
                image={`./assets/${student.epId}.png`}
                sx={{ height: "35vh", minHeight: "200px" }}
              /> */}
              </Box>
              <Box sx={{ flexGrow: 5, maxWidth: "85%" }}>
                <CardContent>
                  <StudentInfo student={student} />
                </CardContent>
              </Box>
              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "5%",
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
          </ListItem>
        );
      })}
    </List>
  );
};
