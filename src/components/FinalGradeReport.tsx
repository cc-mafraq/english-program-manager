import { Box, Button, Grid, Typography } from "@mui/material";
import { indexOf, join, map, nth, slice, split } from "lodash";
import React, { useRef, useState } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { FGRGridRow } from ".";
import { FinalResult, Student } from "../interfaces";
import { getLevelForNextSession } from "../services";

const FGR_WIDTH = 640;
const IMAGE_WIDTH = FGR_WIDTH - 30;
const FGR_SPACING = 2;
const BORDER_SIZE = 15;
const BACKGROUND_COLOR_MAIN = "rgba(255,242,204,1)";
const BACKGROUND_COLOR_SECONDARY = "rgba(117,219,255,1)";

export const FinalGradeReport = ({
  session,
  student,
}: {
  session: Student["initialSession"];
  student: Student;
}) => {
  const componentRef = useRef(null);
  const academicRecord = nth(
    student?.academicRecords,
    indexOf(map(student?.academicRecords, "session"), session),
  );
  const [shouldShow, setShouldShow] = useState(true);

  const downloadFGR = () => {
    exportComponentAsPNG(componentRef, {
      fileName: `${join(slice(split(student.name.english, " "), 0, 2), "_")}_${student.epId}`,
    });
    setShouldShow(false);
  };

  return academicRecord && shouldShow ? (
    <>
      <Button onClick={downloadFGR}>Download</Button>
      <div ref={componentRef} style={{ width: FGR_WIDTH }}>
        <Box
          sx={{
            border: BORDER_SIZE,
            borderBottom: 0,
            borderColor: "#002060",
          }}
        >
          <img alt="FGR Border" src="./assets/fgr-border.jpg" width={IMAGE_WIDTH} />
        </Box>
        <Grid
          container
          marginLeft={0}
          marginTop={0}
          sx={{ backgroundColor: "white" }}
          width={FGR_WIDTH}
        >
          <Grid
            border={BORDER_SIZE}
            borderBottom={1}
            borderColor="#002060"
            borderTop={1}
            container
            padding={FGR_SPACING}
          >
            <Grid item marginBottom="auto" marginTop="auto" xs={1}>
              <img alt="EP Logo" src="./assets/ep-logo-full.png" width="60px" />
            </Grid>
            <Grid item xs={7}>
              <Typography fontSize="20pt" fontWeight="bold" textAlign="center" variant="h5">
                CCM English Program: Final Grade Report
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography textAlign="right" variant="h5">
                برنامج الانجليزي: تقرير العلامات في الصف
              </Typography>
            </Grid>
          </Grid>
          <Grid border={BORDER_SIZE} borderBottom={0} borderColor="#002060" borderTop={0} container>
            <FGRGridRow
              colText1="Name:"
              colText2="الإسم"
              colText3={join(slice(split(student.name.english, " "), 0, 2), " ")}
              labelBackgroundColor={BACKGROUND_COLOR_MAIN}
            />
            <FGRGridRow
              colText1="Student ID #:"
              colText2="رقم البطاقة"
              colText3={student.epId.toString()}
              labelBackgroundColor={BACKGROUND_COLOR_MAIN}
            />
            <FGRGridRow
              colText1="Session:"
              colText2="الفصل"
              colText3={session}
              labelBackgroundColor={BACKGROUND_COLOR_MAIN}
            />
            <FGRGridRow
              colText1="Level:"
              colText2="المستوى"
              colText3={getLevelForNextSession(student, academicRecord, true)}
              labelBackgroundColor={BACKGROUND_COLOR_MAIN}
            />
            {academicRecord.finalResult?.percentage ? (
              <FGRGridRow
                colText1="Class Grade:"
                colText2="العلامة في الصف"
                colText3={`${academicRecord.finalResult.percentage}%`}
                labelBackgroundColor={BACKGROUND_COLOR_SECONDARY}
              />
            ) : (
              <></>
            )}
            {academicRecord.attendance ? (
              <FGRGridRow
                colText1="Class Attendance:"
                colText2="الحضور"
                colText3={`${academicRecord.attendance}%`}
                labelBackgroundColor={BACKGROUND_COLOR_SECONDARY}
              />
            ) : (
              <></>
            )}
            {academicRecord.exitWritingExam?.result !== undefined ? (
              <FGRGridRow
                colText1="Exit Writing Exam: Pass or Fail"
                colText2="امتحان المستوى بالكتابة: ناجح او راسب"
                colText3={
                  FinalResult[academicRecord.exitWritingExam.result] === "P" ? "Pass" : "Fail"
                }
                labelBackgroundColor={BACKGROUND_COLOR_SECONDARY}
              />
            ) : (
              <></>
            )}
            {academicRecord.exitSpeakingExam?.result !== undefined ? (
              <FGRGridRow
                colText1="Exit Speaking Exam: Pass or Fail"
                colText2="امتحان المستوى بالمحادثة: ناجح او راسب"
                colText3={
                  FinalResult[academicRecord.exitSpeakingExam.result] === "P" ? "Pass" : "Fail"
                }
                labelBackgroundColor={BACKGROUND_COLOR_SECONDARY}
              />
            ) : (
              <></>
            )}
            {academicRecord.finalResult?.result !== undefined ? (
              <FGRGridRow
                colText1="Level: Pass or Repeat"
                colText2="المستوى: ناجح او راسب, لازم تبقى بنفس السمتوى"
                colText3={
                  FinalResult[academicRecord.finalResult.result] === "P" ? "Pass" : "Repeat"
                }
                labelBackgroundColor={BACKGROUND_COLOR_SECONDARY}
              />
            ) : (
              <></>
            )}
            <FGRGridRow
              colText1="Your Level for Next Session"
              colText2="مستواك في الدورة الجاي"
              colText3={getLevelForNextSession(student, academicRecord)}
              colText3Props={{ fontWeight: "bold" }}
              labelBackgroundColor={BACKGROUND_COLOR_MAIN}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            border: BORDER_SIZE,
            borderBottom: 0,
            borderColor: "#002060",
            transform: "scaleY(-1)",
          }}
        >
          <img alt="FGR Border" src="./assets/fgr-border.jpg" width={IMAGE_WIDTH} />
        </Box>
      </div>
    </>
  ) : (
    <></>
  );
};
