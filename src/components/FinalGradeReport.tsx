import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { Box, Card, Grid, IconButton, useTheme } from "@mui/material";
import download from "downloadjs";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { join, map, nth, replace, slice, split } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FGRGridRow, FGRGridRowProps, FGRHeader } from ".";
import { FinalResult, Student } from "../interfaces";
import {
  getElectiveFullName,
  getLevelForNextSession,
  getSessionFullName,
  isElective,
  StudentAcademicRecordIndex,
} from "../services";

interface FinalGradeReportProps {
  handleDownloadFinished: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  handleRemoveFGR: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  scale: number;
  session: Student["initialSession"];
  shouldDownload: boolean;
  studentAcademicRecord: StudentAcademicRecordIndex;
  width: number;
  zip: JSZip;
}

interface FGRGridRowMapProps extends FGRGridRowProps {
  conditionToShow?: boolean;
}

export const FinalGradeReport: React.FC<FinalGradeReportProps> = ({
  handleDownloadFinished,
  handleRemoveFGR,
  session,
  studentAcademicRecord,
  shouldDownload,
  scale,
  width,
  zip,
}) => {
  const { student } = studentAcademicRecord;
  const academicRecord = nth(student.academicRecords, studentAcademicRecord.academicRecordIndex);
  const fileName = `${join(slice(split(student.name.english, " "), 0, 2), "_")}_${student.epId}_${
    studentAcademicRecord.academicRecordIndex + 1
  }.png`;

  const imageWidth = width - 30 * scale;
  const fgrHeight = 870;
  const headerSpacing = 2 * scale;
  const borderSize = 15 * scale;
  const smallBorderSize = 1;
  const cardMargin = `${5 * scale}px`;
  const cardPadding = `${10 * scale}px`;
  const backgroundColorMain = "rgba(255,242,204,1)";
  const backgroundColorSecondary = "rgba(117,219,255,1)";
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  const [isDownloaded, setIsDownloaded] = useState(false);
  const componentRef = useRef(null);

  const downloadFGR = useCallback(
    (dl: boolean) => {
      return async () => {
        if (componentRef.current) {
          const imgData = await toPng(componentRef.current, {
            backgroundColor: primaryColor,
            canvasHeight: fgrHeight,
            canvasWidth: width / scale,
            skipAutoScale: true,
          });
          if (dl) {
            await download(imgData, fileName);
            setIsDownloaded(true);
          }
          return imgData;
        }
        return null;
      };
    },
    [fileName, width],
  );

  useEffect(() => {
    const downloadAllCalled = async () => {
      if (shouldDownload) {
        const img = await downloadFGR(false)();
        if (img) {
          const imgClean = replace(img, "data:image/png;base64,", "");
          await zip.file(fileName, imgClean, { base64: true });
          await handleDownloadFinished(studentAcademicRecord);
          setIsDownloaded(true);
        }
      }
    };
    downloadAllCalled();
  }, [shouldDownload]);

  const fgrGridRowData: FGRGridRowMapProps[] = [
    {
      colText1: "Name:",
      colText2: "الإسم",
      colText3: join(slice(split(student.name.english, " "), 0, 2), " "),
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Student ID #:",
      colText2: "رقم البطاقة",
      colText3: student.epId.toString(),
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Session:",
      colText2: "الفصل",
      colText3: getSessionFullName(session),
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Level:",
      colText2: "المستوى",
      colText3: academicRecord
        ? getLevelForNextSession({ academicRecord, noIncrement: true, student })
        : "",
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Name of Class:",
      colText2: "إسم الصف",
      colText3: academicRecord?.level
        ? getElectiveFullName(academicRecord.level)
        : "Not Applicable",
      conditionToShow: academicRecord && isElective(academicRecord),
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Class Grade:",
      colText2: "العلامة في الصف",
      colText3: academicRecord?.finalResult?.percentage
        ? `${academicRecord.finalResult.percentage}%`
        : "Not Applicable",
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Class Attendance:",
      colText2: "الحضور",
      colText3: academicRecord?.attendance ? `${academicRecord.attendance}%` : "Not Applicable",
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Exit Writing Exam: Pass or Fail",
      colText2: "امتحان المستوى بالكتابة: ناجح او راسب",
      colText3:
        academicRecord?.exitWritingExam?.result !== undefined
          ? FinalResult[academicRecord.exitWritingExam.result] === "P"
            ? "Pass"
            : "Fail"
          : "Not Applicable",
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Exit Speaking Exam: Pass or Fail",
      colText2: "امتحان المستوى بالمحادثة: ناجح او راسب",
      colText3:
        academicRecord?.exitSpeakingExam?.result !== undefined
          ? FinalResult[academicRecord.exitSpeakingExam.result] === "P"
            ? "Pass"
            : "Fail"
          : "Not Applicable",
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Level: Pass or Repeat",
      colText2: "المستوى: ناجح او راسب, لازم تبقى بنفس السمتوى",
      colText3:
        academicRecord?.finalResult && FinalResult[academicRecord.finalResult.result] === "P"
          ? "Pass"
          : "Repeat",
      conditionToShow: academicRecord?.finalResult?.result !== undefined,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Your Level for Next Session",
      colText2: "مستواك في الدورة الجاي",
      colText3: academicRecord ? getLevelForNextSession({ academicRecord, student }) : "",
      colText3Props: { fontWeight: "bold" },
      labelBackgroundColor: backgroundColorMain,
    },
  ];

  return academicRecord ? (
    <Card sx={{ margin: cardMargin, padding: cardPadding }}>
      <Box display="flex" flexDirection="row">
        <IconButton
          color="error"
          onClick={() => {
            handleRemoveFGR(studentAcademicRecord);
          }}
        >
          <CloseIcon color="error" />
        </IconButton>

        <IconButton color="primary" onClick={downloadFGR(true)}>
          {isDownloaded ? <DownloadDoneIcon /> : <DownloadIcon />}
        </IconButton>
      </Box>
      <div ref={componentRef} style={{ width }}>
        <Box
          sx={{
            border: borderSize,
            borderBottom: 0,
            borderColor: { primaryColor },
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
          <FGRHeader
            borderSize={borderSize}
            scale={scale}
            smallBorderSize={smallBorderSize}
            spacing={headerSpacing}
          />
          <Grid
            border={borderSize}
            borderBottom={0}
            borderColor={primaryColor}
            borderTop={0}
            container
          >
            {map(fgrGridRowData, (fgrData) => {
              return fgrData.conditionToShow === undefined || fgrData.conditionToShow ? (
                <FGRGridRow scale={scale} smallBorderSize={smallBorderSize} {...fgrData} />
              ) : (
                <></>
              );
            })}
          </Grid>
        </Grid>
        <Box
          sx={{
            border: borderSize,
            borderBottom: 0,
            borderColor: { primaryColor },
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
