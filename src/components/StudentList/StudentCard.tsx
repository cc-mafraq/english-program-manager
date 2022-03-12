import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton } from "@mui/material";
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
        <LabeledText
          condition={dataVisibility.programInformation.inviteTag}
          containerProps={{
            marginTop: 1,
            padding: 0.5,
            sx: {
              backgroundColor: student.status.inviteTag ? "rgba(198,224,180,1)" : "rgba(255,175,175,1)",
              float: "none",
            },
            textAlign: "center",
          }}
          label="Invite"
        >
          {student.status.inviteTag ? "Yes" : "No"}
        </LabeledText>
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
        {/* <IconButton>
          <PersonIcon />
        </IconButton> */}
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
