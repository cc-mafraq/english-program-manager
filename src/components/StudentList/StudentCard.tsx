import { Box, Card, CardContent, Tab, Tabs, useTheme } from "@mui/material";
import React, { CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { CorrespondenceList, Image, PlacementList, StudentCardHeader, StudentInfo } from "..";
import { AppContext, darkBlueBackground, Student } from "../../interfaces";
import { studentImageFolder } from "../../services";
import { AcademicRecords } from "./AcademicRecords";

interface StudentCardProps {
  handleEditStudentClick: () => void;
  index?: number;
  setSize?: (index: number, size: number) => void;
  setTabValue: (epId: Student["epId"], tabValue: number) => void;
  student: Student;
  style?: CSSProperties;
  tabValue: number;
  windowWidth?: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  handleEditStudentClick,
  setSize,
  windowWidth,
  index,
  style,
  tabValue,
  setTabValue,
}) => {
  const theme = useTheme();
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);

  const rowRef = useRef<HTMLDivElement>(null);
  const [localTabValue, setLocalTabValue] = useState(tabValue || 0);

  useEffect(() => {
    if (rowRef.current && setSize && index !== undefined) {
      setSize(index, rowRef.current.clientHeight);
    }
  }, [index, setSize, windowWidth, localTabValue, rowRef.current?.clientHeight]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setLocalTabValue(newValue);
    setTabValue(student.epId, newValue);
  };

  useEffect(() => {
    setLocalTabValue(tabValue);
  }, [tabValue]);

  return (
    <div style={style ? { ...style, paddingLeft: "16px", paddingTop: "16px" } : undefined}>
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? darkBlueBackground : undefined,
          marginLeft: "5px",
          width: "100%",
        }}
      >
        <Box ref={rowRef} display="flex">
          {dataVisibility.studentImages.studentPhoto && (
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
              <Tabs onChange={handleChange} sx={{ display: "inline" }} value={localTabValue}>
                <Tab id="student-card-tabpanel-0" label="Student Information" />
                <Tab id="student-card-tabpanel-1" label="Correspondence" />
                <Tab id="student-card-tabpanel-2" label="Academic Records" />
                <Tab id="student-card-tabpanel-3" label="Placement" />
              </Tabs>
              <Box hidden={localTabValue !== 0} id="student-card-tabpanel-0" role="tabpanel">
                <StudentInfo student={student} />
              </Box>
              <Box hidden={localTabValue !== 1} id="student-card-tabpanel-1" role="tabpanel">
                <CorrespondenceList student={student} />
              </Box>
              <Box hidden={localTabValue !== 2} id="student-card-tabpanel-2" role="tabpanel">
                <AcademicRecords student={student} />
              </Box>
              <Box hidden={localTabValue !== 3} id="student-card-tabpanel-3" role="tabpanel">
                <PlacementList student={student} />
              </Box>
            </CardContent>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

StudentCard.defaultProps = {
  index: undefined,
  setSize: undefined,
  style: undefined,
  windowWidth: undefined,
};
