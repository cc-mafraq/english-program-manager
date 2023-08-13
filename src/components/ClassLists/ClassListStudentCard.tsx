import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { PhoneNumbers, StudentCardHeader, StudentCardImage } from "..";
import { Status, Student, emptyStudent } from "../../interfaces";
import { getRepeatNum } from "../../services";
import { CustomCard, LabeledContainer, LabeledText } from "../reusables";

const ClassListStudentInfoMemo: React.FC<{ data: Student }> = React.memo(({ data }) => {
  const repeatNum = useMemo(() => {
    return getRepeatNum(data);
  }, [data]);
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box sx={greaterThanSmall ? { display: "flex", flexWrap: "wrap" } : undefined}>
      <LabeledContainer label="Student Information">
        <LabeledText label="Current Level">{data.currentLevel}</LabeledText>
        <LabeledText label="Status">{Status[data.status.currentStatus]}</LabeledText>
        <LabeledText label="Nationality">{data.nationality}</LabeledText>
        <LabeledText label="Gender">{data.gender}</LabeledText>
        <LabeledText label="Repeat Number">{repeatNum}</LabeledText>
      </LabeledContainer>
      <PhoneNumbers data={data} noWhatsapp />
    </Box>
  );
});
ClassListStudentInfoMemo.displayName = "Class List Student Info";

export const ClassListStudentCard: React.FC = (props) => {
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
          component: <ClassListStudentInfoMemo data={emptyStudent} />,
          label: "Student Information",
        },
      ]}
      {...props}
    />
  );
};
