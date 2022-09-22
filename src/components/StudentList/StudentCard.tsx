import { Box, Card, CardContent, Tab, Tabs, useTheme } from "@mui/material";
import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CorrespondenceList, Image, PlacementList, StudentCardHeader, StudentInfo, WithdrawButton } from "..";
import { AppContext, darkBlueBackground, Nationality, Status, Student } from "../../interfaces";
import { studentImageFolder } from "../../services";
import { AcademicRecords } from "./AcademicRecords";

interface StudentCardProps {
  data: Student;
  handleEditStudentClick: () => void;
  id?: string | number;
  index?: number;
  setSize?: (index: number, size: number) => void;
  setTabValue?: (id: string | number, tabValue: number) => void;
  style?: CSSProperties;
  tabValue: number;
  windowWidth?: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  id,
  data: student,
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
    appState: { role },
  } = useContext(AppContext);

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
      setTabValue && setTabValue(id || 0, newValue);
    },
    [setTabValue, id],
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
                left: "88px",
                position: "absolute",
                top: "125px",
                transform: "translate(-50%, -50%)",
              }}
              outerContainerProps={{
                minWidth: "175px",
                sx: {
                  border: "solid",
                  borderColor: student.nationality === Nationality.JDN ? "rgb(0,176,80)" : "rgb(204,102,0)",
                  borderWidth:
                    (student.nationality === Nationality.JDN || student.nationality === Nationality.SYR) &&
                    role === "admin"
                      ? 2
                      : 0,
                  height: "250px",
                },
              }}
              scale={2}
              student={student}
            />
            {student.status.currentStatus !== Status.WD && role === "admin" && (
              <WithdrawButton student={student} />
            )}
          </Box>
          <Box width="100%">
            <CardContent>
              <StudentCardHeader handleEditStudentClick={handleEditStudentClick} student={student} />
              {(role === "admin" || role === "faculty") && (
                <Tabs onChange={handleChange} sx={{ display: "inline" }} value={localTabValue}>
                  <Tab id="student-card-tabpanel-0" label="Student Information" />
                  <Tab id="student-card-tabpanel-1" label="Correspondence" />
                  <Tab id="student-card-tabpanel-2" label="Academic Records" />
                  <Tab id="student-card-tabpanel-3" label="Placement" />
                </Tabs>
              )}
              <Box hidden={localTabValue !== 0} id="student-card-tabpanel-0" role="tabpanel">
                <StudentInfo student={student} />
              </Box>
              <Box hidden={localTabValue !== 1 || role !== "admin"} id="student-card-tabpanel-1" role="tabpanel">
                <CorrespondenceList student={student} />
              </Box>
              <Box
                hidden={localTabValue !== 2 || (role !== "admin" && role !== "faculty")}
                id="student-card-tabpanel-2"
                role="tabpanel"
              >
                <AcademicRecords student={student} />
              </Box>
              <Box
                hidden={localTabValue !== 3 || (role !== "admin" && role !== "faculty")}
                id="student-card-tabpanel-3"
                role="tabpanel"
              >
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
  id: undefined,
  index: undefined,
  setSize: undefined,
  setTabValue: undefined,
  style: undefined,
  windowWidth: undefined,
};
