import { Close, Download, DownloadDone, Edit, EditOff } from "@mui/icons-material";
import { Box, Card, Grid, IconButton, Tooltip } from "@mui/material";
import download from "downloadjs";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { countBy, isUndefined, map, nth, replace } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FGRGridRow, FGRGridRowProps, FGRHeader } from ".";
import { useFinalGradeReportStore } from "../../hooks";
import { FinalResult, Student, lightPrimaryColor } from "../../interfaces";
import {
  FinalGradeReportFormValues,
  StudentAcademicRecordIndex,
  getElectiveFullName,
  getLevelForNextSession,
  getSessionFullName,
  getStudentShortName,
  isElective,
} from "../../services";
import { FGRForm } from "./FGRForm";

interface FinalGradeReportProps {
  handleDownloadFinished: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  handleRemoveFGR: (studentAcademicRecord: StudentAcademicRecordIndex) => void;
  scale: number;
  session: Student["initialSession"];
  sessionOptions: Student["initialSession"][];
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
  scale,
  width,
  zip,
}) => {
  const { student } = studentAcademicRecord;
  const academicRecord = nth(student.academicRecords, studentAcademicRecord.academicRecordIndex);
  const fileStartString = `${replace(replace(getStudentShortName(student), /"/g, ""), /\s/g, "_")}_${
    student.epId
  }`;
  const fileName =
    academicRecord && countBy(student.academicRecords, "session")[academicRecord.session] > 1
      ? `${fileStartString}_${studentAcademicRecord.academicRecordIndex + 1}.png`
      : `${fileStartString}.png`;

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

  const downloadFGR = useCallback(async () => {
    if (componentRef.current) {
      const imgData = await toPng(componentRef.current, {
        backgroundColor: lightPrimaryColor,
        canvasHeight: fgrHeight,
        canvasWidth: width / scale,
        skipAutoScale: true,
      });
      return imgData;
    }
    return null;
  }, [scale, width]);

  const handleDownload = useCallback(async () => {
    const imgData = await downloadFGR();
    if (!imgData) return;
    await download(imgData, fileName);
    setIsDownloaded(true);
  }, [downloadFGR, fileName]);

  const downloadAllCalled = useCallback(
    async (shouldDownload: boolean) => {
      if (!shouldDownload) return;
      const img = await downloadFGR();
      if (!img) return;
      const imgClean = replace(img, "data:image/png;base64,", "");
      await zip.file(fileName, imgClean, { base64: true });
      await handleDownloadFinished(studentAcademicRecord);
      setIsDownloaded(true);
    },
    [downloadFGR, fileName, handleDownloadFinished, studentAcademicRecord, zip],
  );

  useEffect(() => {
    const unsub = useFinalGradeReportStore.subscribe((state) => {
      return state.shouldDownload;
    }, downloadAllCalled);
    return () => {
      unsub();
    };
  }, [downloadAllCalled]);

  const [fgrValues, setFgrValues] = useState<FinalGradeReportFormValues>({
    attendance: academicRecord?.attendance !== undefined ? `${academicRecord.attendance}%` : "Not Applicable",
    classGrade:
      academicRecord?.finalGrade?.percentage !== undefined
        ? `${academicRecord.finalGrade.percentage}%`
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
      academicRecord?.overallResult && FinalResult[academicRecord.overallResult] === "P" ? "Pass" : "Repeat",
    session: getSessionFullName(session),
    studentId: student.epId.toString(),
  });
  const [elective, setElective] = useState(
    academicRecord !== undefined && isElective(academicRecord.level || academicRecord.levelAudited),
  );

  const fgrGridRowData: FGRGridRowMapProps[] = [
    {
      colText1: "Name:",
      colText2: "الإسم",
      colText3: fgrValues.name,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Student ID #:",
      colText2: "رقم البطاقة",
      colText3: fgrValues.studentId,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Session:",
      colText2: "الفصل",
      colText3: fgrValues.session,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Level:",
      colText2: "المستوى",
      colText3: fgrValues.level,
      labelBackgroundColor: backgroundColorMain,
    },
    {
      colText1: "Name of Class:",
      colText2: "إسم الصف",
      colText3: fgrValues.className || "Not Applicable",
      conditionToShow: elective,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Class Grade:",
      colText2: "العلامة في الصف",
      colText3: fgrValues.classGrade,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Class Attendance:",
      colText2: "الحضور",
      colText3: fgrValues.attendance,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Exit Writing Exam: Pass or Fail",
      colText2: "امتحان المستوى بالكتابة: ناجح او راسب",
      colText3: fgrValues.exitWritingExam,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Exit Speaking Exam: Pass or Fail",
      colText2: "امتحان المستوى بالمحادثة: ناجح او راسب",
      colText3: fgrValues.exitSpeakingExam,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Level: Pass or Repeat",
      colText2: "المستوى: ناجح او راسب, لازم تبقى بنفس السمتوى",
      colText3: fgrValues.passOrRepeat || "Not Applicable",
      conditionToShow: !elective,
      labelBackgroundColor: backgroundColorSecondary,
    },
    {
      colText1: "Your Level for Next Session",
      colText2: "مستواك في الدورة الجاي",
      colText3: fgrValues.nextSessionLevel,
      colText3Props: { fontWeight: "bold" },
      labelBackgroundColor: backgroundColorMain,
    },
  ];

  return academicRecord ? (
    <Card sx={{ margin: cardMargin, padding: cardPadding }}>
      <Box display="flex" flexDirection="row">
        <Tooltip arrow title="Remove">
          <IconButton
            onClick={() => {
              handleRemoveFGR(studentAcademicRecord);
            }}
          >
            <Close />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title={isDownloaded ? "Download Complete" : "Download"}>
          <IconButton color="primary" onClick={handleDownload}>
            {isDownloaded ? <DownloadDone /> : <Download />}
          </IconButton>
        </Tooltip>
        <Tooltip arrow title={isEditing ? "Cancel Edit" : "Edit"}>
          <IconButton
            color="primary"
            onClick={() => {
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? <EditOff /> : <Edit />}
          </IconButton>
        </Tooltip>
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
