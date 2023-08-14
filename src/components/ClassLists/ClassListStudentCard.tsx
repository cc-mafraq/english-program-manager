import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { PhoneNumbers, StudentCardHeader, StudentCardImage } from "..";
import { Status, Student, emptyStudent } from "../../interfaces";
import { getRepeatNum } from "../../services";
import { CustomCard, LabeledContainer, LabeledText } from "../reusables";

const ClassListStudentInfoMemo: React.FC<{ allSameGender: boolean; allSameLevel: boolean; data: Student }> =
  React.memo(({ data, allSameLevel, allSameGender }) => {
    const repeatNum = useMemo(() => {
      return getRepeatNum(data);
    }, [data]);
    const theme = useTheme();
    const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

    return (
      <Box sx={greaterThanSmall ? { display: "flex", flexWrap: "wrap" } : undefined}>
        <LabeledContainer label="Student Information">
          {!allSameLevel && <LabeledText label="Current Level">{data.currentLevel}</LabeledText>}
          <LabeledText label="Status">{Status[data.status.currentStatus]}</LabeledText>
          <LabeledText label="Nationality">{data.nationality}</LabeledText>
          {!allSameGender && <LabeledText label="Gender">{data.gender === "M" ? "Male" : "Female"}</LabeledText>}
          <LabeledText label="Repeat Number">{repeatNum}</LabeledText>
        </LabeledContainer>
        <PhoneNumbers data={data} noWhatsapp />
      </Box>
    );
  });
ClassListStudentInfoMemo.displayName = "Class List Student Info";

interface ClassListStudentCardProps {
  allSameGender: boolean;
  allSameLevel: boolean;
}

export const ClassListStudentCard: React.FC<ClassListStudentCardProps> = (props) => {
  const { allSameGender, allSameLevel } = props;
  return (
    <CustomCard
      data={emptyStudent}
      header={<StudentCardHeader data={emptyStudent} />}
      image={
        <StudentCardImage data={emptyStudent} imageWidth={150} noBorder noButtons smallBreakpointScaleDown={1.5} />
      }
      noTabs
      tabContents={[
        {
          component: (
            <ClassListStudentInfoMemo
              allSameGender={allSameGender}
              allSameLevel={allSameLevel}
              data={emptyStudent}
            />
          ),
          label: "Student Information",
        },
      ]}
      {...props}
    />
  );
};
