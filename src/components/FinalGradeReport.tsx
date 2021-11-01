import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Card, Grid, IconButton, Typography } from "@mui/material";
import { indexOf, join, map, nth, slice, split } from "lodash";
import React, { useRef, useState } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { FGRGridRow } from ".";
import { FinalResult, Student } from "../interfaces";
import { getLevelForNextSession } from "../services";

export const FinalGradeReport = ({
  session,
  student,
  scale,
  width,
}: {
  scale: number;
  session: Student["initialSession"];
  student: Student;
  width: number;
}) => {
  const imageWidth = width - 30 * scale;
  const spacing = 2 * scale;
  const borderSize = 15 * scale;
  const backgroundColorMain = "rgba(255,242,204,1)";
  const backgroundColorSecondary = "rgba(117,219,255,1)";

  const componentRef = useRef(null);
  const academicRecord = nth(
    student?.academicRecords,
    indexOf(map(student?.academicRecords, "session"), session),
  );
  const [shouldShow, setShouldShow] = useState(true);

  const downloadFGR = () => {
    exportComponentAsPNG(componentRef, {
      fileName: `${join(slice(split(student.name.english, " "), 0, 2), "_")}_${student.epId}`,
      html2CanvasOptions: {
        scale: 1 / scale,
      },
    });
    setShouldShow(false);
  };

  return academicRecord && shouldShow ? (
    <Card sx={{ margin: `${5 * scale}px`, padding: `${10 * scale}px`, width }}>
      <Box display="flex" flexDirection="row">
        <IconButton
          color="error"
          onClick={() => {
            setShouldShow(false);
          }}
        >
          <CloseIcon color="error" />
        </IconButton>
        <IconButton color="primary" onClick={downloadFGR}>
          <DownloadIcon />
        </IconButton>
      </Box>
      <div ref={componentRef} style={{ width }}>
        <Box
          sx={{
            border: borderSize,
            borderBottom: 0,
            borderColor: "#002060",
          }}
        >
          <img alt="FGR Border" src="./assets/fgr-border.jpg" width={imageWidth} />
        </Box>
        <Grid
          container
          marginLeft={0}
          marginTop={0}
          sx={{ backgroundColor: "white" }}
          width={width}
        >
          <Grid
            border={borderSize}
            borderBottom={1 * scale}
            borderColor="#002060"
            borderTop={1 * scale}
            container
            padding={spacing}
          >
            <Grid item marginBottom="auto" marginTop="auto" xs={1}>
              <img alt="EP Logo" src="./assets/ep-logo-full.png" width={`${60 * scale}px`} />
            </Grid>
            <Grid item xs={7}>
              <Typography
                fontSize={`${20 * scale}pt`}
                fontWeight="bold"
                textAlign="center"
                variant="h5"
              >
                CCM English Program: Final Grade Report
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography fontSize={`${18 * scale}pt`} textAlign="right" variant="h5">
                برنامج الانجليزي: تقرير العلامات في الصف
              </Typography>
            </Grid>
          </Grid>
          <Grid border={borderSize} borderBottom={0} borderColor="#002060" borderTop={0} container>
            <FGRGridRow
              colText1="Name:"
              colText2="الإسم"
              colText3={join(slice(split(student.name.english, " "), 0, 2), " ")}
              labelBackgroundColor={backgroundColorMain}
              scale={scale}
            />
            <FGRGridRow
              colText1="Student ID #:"
              colText2="رقم البطاقة"
              colText3={student.epId.toString()}
              labelBackgroundColor={backgroundColorMain}
              scale={scale}
            />
            <FGRGridRow
              colText1="Session:"
              colText2="الفصل"
              colText3={session}
              labelBackgroundColor={backgroundColorMain}
              scale={scale}
            />
            <FGRGridRow
              colText1="Level:"
              colText2="المستوى"
              colText3={getLevelForNextSession(student, academicRecord, true)}
              labelBackgroundColor={backgroundColorMain}
              scale={scale}
            />
            {academicRecord.finalResult?.percentage ? (
              <FGRGridRow
                colText1="Class Grade:"
                colText2="العلامة في الصف"
                colText3={`${academicRecord.finalResult.percentage}%`}
                labelBackgroundColor={backgroundColorSecondary}
                scale={scale}
              />
            ) : (
              <></>
            )}
            {academicRecord.attendance ? (
              <FGRGridRow
                colText1="Class Attendance:"
                colText2="الحضور"
                colText3={`${academicRecord.attendance}%`}
                labelBackgroundColor={backgroundColorSecondary}
                scale={scale}
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
                labelBackgroundColor={backgroundColorSecondary}
                scale={scale}
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
                labelBackgroundColor={backgroundColorSecondary}
                scale={scale}
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
                labelBackgroundColor={backgroundColorSecondary}
                scale={scale}
              />
            ) : (
              <></>
            )}
            <FGRGridRow
              colText1="Your Level for Next Session"
              colText2="مستواك في الدورة الجاي"
              colText3={getLevelForNextSession(student, academicRecord)}
              colText3Props={{ fontWeight: "bold" }}
              labelBackgroundColor={backgroundColorMain}
              scale={scale}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            border: borderSize,
            borderBottom: 0,
            borderColor: "#002060",
            transform: "scaleY(-1)",
          }}
        >
          <img alt="FGR Border" src="./assets/fgr-border.jpg" width={imageWidth} />
        </Box>
      </div>
    </Card>
  ) : (
    <></>
  );
};
