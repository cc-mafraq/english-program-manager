import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { Box, Card, CardContent, CardMedia, IconButton, Tab, Tabs, useTheme } from "@mui/material";
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Correspondence, StudentCardHeader, StudentInfo } from "..";
import { AppContext, darkBlueBackground, Student } from "../../interfaces";
import { getStudentImage, setStudentData, setStudentImage } from "../../services";
import { AcademicRecords } from "./AcademicRecords";

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
  const [img, setImg] = useState("");
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();

  const imageStyle = { height: "35vh", minHeight: "200px" };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  useEffect(() => {
    setStudentData(student, { merge: true });
  }, [student]);

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? darkBlueBackground : undefined,
        marginLeft: "5px",
        width: "100%",
      }}
    >
      <Box display="flex">
        <Box
          sx={{
            minWidth: "150px",
          }}
        >
          {dataVisibility.demographics.photo && img ? (
            <CardMedia component="img" image={img} sx={imageStyle} />
          ) : (
            <Box sx={{ ...imageStyle, position: "relative" }}>
              <Box
                sx={{
                  left: "50%",
                  margin: 0,
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <label htmlFor="importImage">
                  <input
                    accept=".png,.jpg,.jpeg,.jfif"
                    hidden
                    id="importImage"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setStudentImage(student, e.target.files && e.target.files[0]);
                    }}
                    type="file"
                  />
                  <IconButton color="primary" component="span" sx={{ transform: "scale(2)" }}>
                    <InsertPhotoIcon />
                  </IconButton>
                </label>
              </Box>
            </Box>
          )}
        </Box>
        <Box width="100%">
          <CardContent>
            <StudentCardHeader
              handleEditStudentClick={handleEditStudentClick}
              setSelectedStudent={setSelectedStudent}
              student={student}
            />
            <Tabs onChange={handleChange} sx={{ display: "inline" }} value={tabValue}>
              <Tab id="student-card-tabpanel-0" label="Student Information" />
              <Tab id="student-card-tabpanel-1" label="Correspondence" />
              <Tab id="student-card-tabpanel-2" label="Academic Records" />
            </Tabs>
            <Box hidden={tabValue !== 0} id="student-card-tabpanel-0" role="tabpanel">
              <StudentInfo student={student} />
            </Box>
            <Box hidden={tabValue !== 1} id="student-card-tabpanel-1" role="tabpanel">
              <Correspondence student={student} />
            </Box>
            <Box hidden={tabValue !== 2} id="student-card-tabpanel-2" role="tabpanel">
              <AcademicRecords student={student} />
            </Box>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};
