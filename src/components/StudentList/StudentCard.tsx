import { Box, Card, CardContent, CardMedia } from "@mui/material";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { LabeledText, StudentInfo } from "..";
import { AppContext, Student } from "../../interfaces";
import { getStudentImage } from "../../services";

interface StudentCardProps {
  handleEditStudentClick: () => void;
  setSelectedStudent: Dispatch<SetStateAction<Student | undefined>>;
  student: Student;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, setSelectedStudent, handleEditStudentClick }) => {
  const [img, setImg] = useState("");
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);

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
  }, [student]);

  // useEffect(() => {
  //   setStudentData(student, { merge: true });
  // }, [student]);

  return (
    <Card sx={{ display: "flex", marginLeft: "5px", width: "100%" }}>
      <Box
        sx={{
          minWidth: "150px",
        }}
      >
        {dataVisibility.studentInformation.photo ? (
          <CardMedia component="img" image={img} sx={{ height: "35vh", minHeight: "200px" }} />
        ) : (
          <></>
        )}
      </Box>
      <Box>
        <CardContent>
          <StudentInfo
            handleEditStudentClick={handleEditStudentClick}
            setSelectedStudent={setSelectedStudent}
            student={student}
          />
        </CardContent>
      </Box>
      {/* <CardActions
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

      </CardActions> */}
    </Card>
  );
};
