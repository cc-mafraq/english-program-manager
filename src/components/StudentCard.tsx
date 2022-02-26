import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { StudentInfo } from ".";
import { Student } from "../interfaces";

interface StudentCardProps {
  handleEditStudentClick: () => void;
  setSelectedStudent: Dispatch<SetStateAction<Student | undefined>>;
  student: Student;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  setSelectedStudent,
  handleEditStudentClick,
}) => {
  // const [img, setImg] = useState("");

  // useEffect(() => {
  //   const setImage = async () => {
  //     try {
  //       const studentImage = await getStudentImage(student);
  //       setImg(studentImage);
  //     } catch {
  //       setImg("");
  //     }
  //   };
  //   setImage();
  // }, []);

  // useEffect(() => {
  //   setStudentData(student);
  // }, []);

  return (
    <Card sx={{ display: "flex", marginLeft: "5px", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          minWidth: "150px",
        }}
      >
        <CardMedia component="img" /* image={img} */ sx={{ height: "35vh", minHeight: "200px" }} />
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
        <IconButton
          onClick={() => {
            setSelectedStudent(student);
            handleEditStudentClick();
          }}
        >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
