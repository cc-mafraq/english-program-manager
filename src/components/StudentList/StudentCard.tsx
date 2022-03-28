import { Box, Card, CardContent, Tab, Tabs, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { Correspondence, Image, Placement, StudentCardHeader, StudentInfo } from "..";
import { AppContext, darkBlueBackground, Student } from "../../interfaces";
import { studentImageFolder } from "../../services";
import { AcademicRecords } from "./AcademicRecords";

interface StudentCardProps {
  handleEditStudentClick: () => void;
  student: Student;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, handleEditStudentClick }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? darkBlueBackground : undefined,
        marginLeft: "5px",
        width: "100%",
      }}
    >
      <Box display="flex">
        {dataVisibility.demographics.photo && (
          <Image
            folderName={studentImageFolder}
            imagePath="imageName"
            imageStyleProps={{ height: "35vh", minHeight: "200px" }}
            innerContainerProps={{ height: "35vh", minHeight: "200px" }}
            outerContainerProps={{ minWidth: "150px" }}
            scale={2}
            student={student}
          />
        )}
        <Box width="100%">
          <CardContent>
            <StudentCardHeader handleEditStudentClick={handleEditStudentClick} student={student} />
            <Tabs onChange={handleChange} sx={{ display: "inline" }} value={tabValue}>
              <Tab id="student-card-tabpanel-0" label="Student Information" />
              <Tab id="student-card-tabpanel-1" label="Correspondence" />
              <Tab id="student-card-tabpanel-2" label="Academic Records" />
              <Tab id="student-card-tabpanel-3" label="Placement" />
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
            <Box hidden={tabValue !== 3} id="student-card-tabpanel-3" role="tabpanel">
              <Placement student={student} />
            </Box>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};
