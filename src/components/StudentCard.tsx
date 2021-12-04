import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StudentInfo } from ".";
import { Student } from "../interfaces";
import { getStudentImage } from "../services";

interface StudentCardProps {
  student: Student;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const [img, setImg] = useState("");

  useEffect(() => {
    const setImage = async () => {
      try {
        const studentImage = await getStudentImage(student);
        setImg(studentImage);
      } catch {
        setImg("");
      }
    };
    setImage();
  }, []);

  return (
    <Card sx={{ display: "flex", marginLeft: "5px", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          minWidth: "150px",
        }}
      >
        <CardMedia component="img" image={img} sx={{ height: "35vh", minHeight: "200px" }} />
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
  );
};
