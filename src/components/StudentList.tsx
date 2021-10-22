import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { StudentInfo } from ".";
import { SAMPLE_STUDENTS } from "../interfaces";

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
                <StudentInfo student={student} />
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
