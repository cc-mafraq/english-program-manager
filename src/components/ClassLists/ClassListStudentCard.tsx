import { Assessment } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { green as materialGreen, red as materialRed } from "@mui/material/colors";
import { filter, findIndex, nth } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import {
  AcademicRecordAccordionDetails,
  FormAcademicRecordsDialog,
  PhoneNumbers,
  StudentCardHeader,
  StudentCardImage,
} from "..";
import { useColors } from "../../hooks";
import { AcademicRecord, FinalResult, SectionPlacement, Status, Student, emptyStudent } from "../../interfaces";
import { getAcademicRecordByPlacement, getClassName, getRepeatNum } from "../../services";
import { CorrespondenceList, CustomCard, LabeledContainer, LabeledText } from "../reusables";

interface ClassListStudentInfoProps {
  allSameGender: boolean;
  allSameLevel: boolean;
  data: Student;
  selectedAcademicRecord: AcademicRecord | null;
}

const ClassListStudentInfoMemo: React.FC<ClassListStudentInfoProps> = React.memo(
  ({ data, allSameLevel, allSameGender, selectedAcademicRecord }) => {
    const repeatNum = useMemo(() => {
      return getRepeatNum(data);
    }, [data]);
    const theme = useTheme();
    const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

    const borderlineConditions = useMemo(() => {
      return [
        selectedAcademicRecord?.finalGrade?.percentage &&
          selectedAcademicRecord?.finalGrade?.percentage >= 78 &&
          selectedAcademicRecord?.finalGrade?.percentage < 80,
        selectedAcademicRecord?.exitSpeakingExam?.percentage &&
          selectedAcademicRecord?.exitSpeakingExam?.percentage >= 78 &&
          selectedAcademicRecord?.exitSpeakingExam?.percentage < 80,
        selectedAcademicRecord?.exitWritingExam?.percentage &&
          selectedAcademicRecord?.exitWritingExam?.percentage >= 78 &&
          selectedAcademicRecord?.exitWritingExam?.percentage < 80,
        selectedAcademicRecord?.attendance &&
          selectedAcademicRecord?.attendance >= 50 &&
          selectedAcademicRecord?.attendance < 70,
      ];
    }, [
      selectedAcademicRecord?.attendance,
      selectedAcademicRecord?.exitSpeakingExam?.percentage,
      selectedAcademicRecord?.exitWritingExam?.percentage,
      selectedAcademicRecord?.finalGrade?.percentage,
    ]);

    return (
      <Box sx={greaterThanSmall ? { display: "flex", flexWrap: "wrap" } : undefined}>
        <LabeledContainer label="Student Information">
          {!allSameLevel && <LabeledText label="Current Level">{data.currentLevel}</LabeledText>}
          <LabeledText label="Status">{Status[data.status.currentStatus]}</LabeledText>
          <LabeledText label="Nationality">{data.nationality}</LabeledText>
          {!allSameGender && <LabeledText label="Gender">{data.gender === "M" ? "Male" : "Female"}</LabeledText>}
          <LabeledText label="Repeat">{repeatNum}</LabeledText>
        </LabeledContainer>
        <PhoneNumbers data={data} noWhatsapp />

        {selectedAcademicRecord && (
          <Box>
            {filter(borderlineConditions).length > 0 && filter(borderlineConditions).length < 3 && (
              <Typography color={theme.palette.warning.main} variant="h6">
                Warning: Borderline Case!
              </Typography>
            )}
            <AcademicRecordAccordionDetails bold data={selectedAcademicRecord} />
          </Box>
        )}
      </Box>
    );
  },
);
ClassListStudentInfoMemo.displayName = "Class List Student Info";

interface ClassListStudentCardProps {
  allSameGender: boolean;
  allSameLevel: boolean;
  data?: Student;
  selectedClass?: SectionPlacement;
  selectedSession?: string;
}

export const ClassListStudentCard: React.FC<ClassListStudentCardProps> = (props) => {
  const { allSameGender, allSameLevel, data, selectedClass, selectedSession } = props;
  const sessionIndex = useMemo(() => {
    return findIndex(data?.placement, (placement) => {
      return placement.session === selectedSession;
    });
  }, [data?.placement, selectedSession]);
  const classIndex = useMemo(() => {
    return findIndex(nth(data?.placement, sessionIndex)?.placement, (sectionPlacement) => {
      return getClassName(selectedClass) === getClassName(sectionPlacement);
    });
  }, [data?.placement, selectedClass, sessionIndex]);
  const selectedAcademicRecord = getAcademicRecordByPlacement(data, selectedSession, selectedClass);

  const [open, setOpen] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

  const theme = useTheme();
  const { red, green } = useColors();
  const greaterThanMedium = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <CustomCard
        data={emptyStudent}
        header={
          <StudentCardHeader
            data={emptyStudent}
            otherButtons={
              <>
                <Tooltip title="Submit Final Grades">
                  <IconButton onClick={handleDialogOpen}>
                    <Assessment />
                  </IconButton>
                </Tooltip>
                {selectedAcademicRecord?.overallResult && (
                  <Box>
                    <Typography
                      color={
                        selectedAcademicRecord.overallResult === FinalResult.P
                          ? theme.palette.mode === "light"
                            ? materialGreen[600]
                            : green
                          : theme.palette.mode === "light"
                          ? materialRed[600]
                          : red
                      }
                      sx={{ float: "right", fontWeight: "bold", marginRight: greaterThanMedium ? "1vw" : "6vw" }}
                      variant="h6"
                    >
                      {selectedAcademicRecord.overallResult}
                    </Typography>
                  </Box>
                )}
              </>
            }
          />
        }
        image={
          <StudentCardImage
            data={emptyStudent}
            imageContainerProps={{ marginLeft: "15px" }}
            imageWidth={greaterThanMedium ? 65 : 95}
            loadingIconSize="32px"
            noBorder
            noButtons
            noMinWidth
            smallBreakpointScaleDown={1.5}
          />
        }
        tabContents={[
          {
            component: (
              <ClassListStudentInfoMemo
                allSameGender={allSameGender}
                allSameLevel={allSameLevel}
                data={emptyStudent}
                selectedAcademicRecord={selectedAcademicRecord}
              />
            ),
            label: "Student Information",
          },
          {
            component: (
              <CorrespondenceList
                collectionName="students"
                correspondencePath={`placement[${sessionIndex}].placement[${classIndex}].classListNotes`}
                data={emptyStudent}
                idPath="epId"
                itemName="Note"
              />
            ),
            label: "Notes",
          },
        ]}
        {...props}
      />
      <FormAcademicRecordsDialog
        formTitle={data?.name.english}
        handleDialogClose={handleDialogClose}
        open={open}
        selectedAcademicRecord={selectedAcademicRecord}
        shouldSetStudents
        student={data ?? emptyStudent}
      />
    </>
  );
};

ClassListStudentCard.defaultProps = {
  data: undefined,
  selectedClass: undefined,
  selectedSession: undefined,
};
