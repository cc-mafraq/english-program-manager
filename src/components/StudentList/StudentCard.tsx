import { Box, Card, CardContent, CardMedia, Tab, Tabs } from "@mui/material";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Correspondence, StudentCardHeader, StudentInfo } from "..";
import { AppContext, Student } from "../../interfaces";
import { getStudentImage } from "../../services";
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

  // useEffect(() => {
  //   setStudentData(student, { merge: true });
  // }, [student]);

  return (
    <Card sx={{ marginLeft: "5px", paddingBottom: "5px", width: "100%" }}>
      <Box display="flex">
        <Box
          sx={{
            minWidth: "150px",
          }}
        >
          {dataVisibility.demographics.photo ? (
            <CardMedia component="img" image={img} sx={{ height: "35vh", minHeight: "200px" }} />
          ) : (
            <></>
          )}
        </Box>
        <Box>
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
