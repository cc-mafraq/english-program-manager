import { Box, Card, CardContent, Tab, Tabs, useTheme } from "@mui/material";
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { CorrespondenceList, Image, PlacementList, StudentCardHeader, StudentInfo, WithdrawButton } from "..";
import { darkBlueBackground, Nationality, Status, Student } from "../../interfaces";
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

  const rowRef = useRef<HTMLDivElement>(null);
  const [localTabValue, setLocalTabValue] = useState(tabValue || 0);

  useEffect(() => {
    if (rowRef.current && setSize && index !== undefined) {
      setSize(index, rowRef.current.clientHeight);
    }
  }, [index, setSize, windowWidth, localTabValue, rowRef.current?.clientHeight]);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setLocalTabValue(newValue);
      setTabValue(student.epId, newValue);
    },
    [setTabValue, student.epId],
  );

  useEffect(() => {
    setLocalTabValue(tabValue);
  }, [tabValue]);

  return (
    <div style={style ? { ...style, paddingLeft: "10px", paddingTop: "16px" } : undefined}>
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? darkBlueBackground : undefined,
          width: "100%",
        }}
      >
        <Box ref={rowRef} display="flex">
          <Box>
            <Image
              folderName={studentImageFolder}
              imagePath="imageName"
              imageStyleProps={{
                maxHeight: "250px",
                width: "175px",
              }}
              innerContainerProps={{ height: "250px" }}
              loadingContainerProps={{
                marginLeft: "88px",
                marginTop: "125px",
                transform: "translate(-50%, -50%)",
              }}
              outerContainerProps={{
                minWidth: "175px",
                sx: {
                  border: "solid",
                  borderColor: student.nationality === Nationality.JDN ? "rgb(0,176,80)" : "rgb(204,102,0)",
                  borderWidth:
                    student.nationality === Nationality.JDN || student.nationality === Nationality.SYR ? 2 : 0,
                  height: "250px",
                },
              }}
              scale={2}
              student={student}
            />
            {student.status.currentStatus !== Status.WD && <WithdrawButton student={student} />}
          </Box>
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
