import { Close, Download, DownloadDone, Edit, EditOff } from "@mui/icons-material";
import { Box, Card, Grid, IconButton } from "@mui/material";
import download from "downloadjs";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { countBy, isUndefined, map, nth, replace } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FGRGridRow, FGRGridRowProps, FGRHeader } from ".";
import { FinalResult, lightPrimaryColor, Student } from "../../interfaces";
import {
  FinalGradeReportFormValues,
  getElectiveFullName,
  getLevelForNextSession,
  getSessionFullName,
  getStudentShortName,
  isElective,
  StudentAcademicRecordIndex,
} from "../../services";
import { FGRForm } from "./FGRForm";

interface FinalGradeReportProps {
  handleDownloadFinished: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  handleRemoveFGR: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  scale: number;
  session: Student["initialSession"];
  sessionOptions: Student["initialSession"][];
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
  sessionOptions,
  studentAcademicRecord,
  shouldDownload,
  scale,
  width,
  zip,
}) => {
  const { student } = studentAcademicRecord;
  const academicRecord = nth(student.academicRecords, studentAcademicRecord.academicRecordIndex);
  const fileName =
    academicRecord && countBy(student.academicRecords, "session")[academicRecord.session] > 1
      ? `${student.epId}_${studentAcademicRecord.academicRecordIndex + 1}.png`
      : `${student.epId}.png`;

  const imageWidth = width - 32 * scale;
  const fgrHeight = 870;
  const headerSpacing = 2 * scale;
  const borderSize = 16 * scale;
  const smallBorderSize = 1;
  const cardMargin = `${5 * scale}px`;
  const cardPadding = `${10 * scale}px`;
  const backgroundColorMain = "rgba(255,242,204,1)";
  const backgroundColorSecondary = "rgba(117,219,255,1)";

  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const componentRef = useRef(null);

  const downloadFGR = useCallback(
    (dl: boolean) => {
      return async () => {
        if (componentRef.current) {
          const imgData = await toPng(componentRef.current, {
            backgroundColor: lightPrimaryColor,
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
    [fileName, scale, width],
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
  }, [downloadFGR, fileName, handleDownloadFinished, shouldDownload, studentAcademicRecord, zip]);

  const [fgrValues, setFgrValues] = useState<FinalGradeReportFormValues>({
    attendance: academicRecord?.attendance !== undefined ? `${academicRecord.attendance}%` : "Not Applicable",
    classGrade:
      academicRecord?.finalResult?.percentage !== undefined
        ? `${academicRecord.finalResult.percentage}%`
        : "Not Applicable",
    className:
      academicRecord?.levelAudited || academicRecord?.level
        ? getElectiveFullName(academicRecord?.levelAudited || academicRecord?.level || "")
        : "Not Applicable",
    exitSpeakingExam:
      academicRecord?.exitSpeakingExam?.result !== undefined
        ? FinalResult[academicRecord.exitSpeakingExam.result] === "P"
          ? "Pass"
          : FinalResult[academicRecord.exitSpeakingExam.result] === "F"
          ? "Fail"
          : "Not Applicable"
        : "Not Applicable",
    exitWritingExam:
      academicRecord?.exitWritingExam?.result !== undefined
        ? FinalResult[academicRecord.exitWritingExam.result] === "P"
          ? "Pass"
          : FinalResult[academicRecord.exitWritingExam.result] === "F"
          ? "Fail"
          : "Not Applicable"
        : "Not Applicable",
    level: academicRecord
      ? `${getLevelForNextSession({ academicRecord, noIncrement: true, sessionOptions, student })}${
          isUndefined(academicRecord.level) && !isUndefined(academicRecord.levelAudited) ? " Audit" : ""
        }`
      : "",
    name: getStudentShortName(student),
    nextSessionLevel: academicRecord ? getLevelForNextSession({ academicRecord, sessionOptions, student }) : "",
    passOrRepeat:
      academicRecord?.finalResult?.result && FinalResult[academicRecord.finalResult.result] === "P"
        ? "Pass"
        : "Repeat",
    session: getSessionFullName(session),
    studentId: student.epId.toString(),
  });
  const [elective, setElective] = useState(academicRecord !== undefined && isElective(academicRecord));

  const fgrGridRowData: FGRGridRowMapProps[] = [
    {
      colText1: "Name:",
      colText2: "??????????",
      colText3: fgrValues.name,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Student ID #:",
      colText2: "?????? ??????????????",
      colText3: fgrValues.studentId,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Session:",
      colText2: "??????????",
      colText3: fgrValues.session,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Level:",
      colText2: "??????????????",
      colText3: fgrValues.level,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Name of Class:",
      colText2: "?????? ????????",
      colText3: fgrValues.className || "Not Applicable",
      conditionToShow: elective,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Class Grade:",
      colText2: "?????????????? ???? ????????",
      colText3: fgrValues.classGrade,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Class Attendance:",
      colText2: "????????????",
      colText3: fgrValues.attendance,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Exit Writing Exam: Pass or Fail",
      colText2: "???????????? ?????????????? ????????????????: ???????? ???? ????????",
      colText3: fgrValues.exitWritingExam,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Exit Speaking Exam: Pass or Fail",
      colText2: "???????????? ?????????????? ??????????????????: ???????? ???? ????????",
      colText3: fgrValues.exitSpeakingExam,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Level: Pass or Repeat",
      colText2: "??????????????: ???????? ???? ????????, ???????? ???????? ???????? ??????????????",
      colText3: fgrValues.passOrRepeat || "Not Applicable",
      conditionToShow: !elective,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Your Level for Next Session",
      colText2: "???????????? ???? ???????????? ??????????",
      colText3: fgrValues.nextSessionLevel,
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
          <Close color="error" />
        </IconButton>

        <IconButton color="primary" onClick={downloadFGR(true)}>
          {isDownloaded ? <DownloadDone /> : <Download />}
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? <EditOff /> : <Edit />}
        </IconButton>
      </Box>
      {isEditing ? (
        <Box width={width}>
          <FGRForm
            defaultValues={fgrValues}
            elective={elective}
            setElective={setElective}
            setFgrValues={setFgrValues}
            setIsEditing={setIsEditing}
          />
        </Box>
      ) : (
        <div ref={componentRef} style={{ width }}>
          <Box
            sx={{
              backgroundColor: "white",
              border: borderSize,
              borderBottom: smallBorderSize,
              borderColor: lightPrimaryColor,
            }}
          >
            <img alt="FGR Border" src="./assets/fgr-border.jpg" width={imageWidth} />
          </Box>
          <Grid container sx={{ backgroundColor: "white" }} width={width}>
            <FGRHeader
              borderSize={borderSize}
              scale={scale}
              smallBorderSize={smallBorderSize}
              spacing={headerSpacing}
            />
            <Grid border={borderSize} borderBottom={0} borderColor={lightPrimaryColor} borderTop={0} container>
              {map(fgrGridRowData, (fgrData, i) => {
                const key = `fgr-row-${i}-${student.epId}}-${studentAcademicRecord.academicRecordIndex}`;
                return fgrData.conditionToShow === undefined || fgrData.conditionToShow ? (
                  <FGRGridRow
                    key={key}
                    scale={scale}
                    smallBorderSize={i === fgrGridRowData.length - 1 ? 0 : smallBorderSize}
                    {...fgrData}
                  />
                ) : (
                  <React.Fragment key={key} />
                );
              })}
            </Grid>
          </Grid>
          <Box
            sx={{
              backgroundColor: "white",
              border: borderSize,
              borderBottom: smallBorderSize,
              borderColor: lightPrimaryColor,
              transform: "scaleY(-1)",
            }}
          >
            <img alt="FGR Border" src="./assets/fgr-border.jpg" width={imageWidth} />
          </Box>
        </div>
      )}
    </Card>
  ) : (
    <></>
  );
};
