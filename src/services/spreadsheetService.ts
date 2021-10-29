import { cloneDeep, join, replace, slice } from "lodash";
import papa from "papaparse";
import { emptyStudent, Student } from "../interfaces";
import * as ps from "./parsingService";

export interface ValidFields {
  [key: string]: (key: string, value: string, student: Student) => void;
}

const fieldCleanRegex = /[\s)(\-#/+:,;&%]/g; // /\s|(|)|-|#|\/|+|:|,|;|&|%/g;

const studentFields: ValidFields = ps.expand({
  ADJ: ps.parseOrigPlacementAdjustment,
  AGEATPROGENTRY: ps.parseAge,
  AUD: ps.parseAudit,
  "Att,Att40,Att53,Att66,Att79,Att92,Att105,Att118,Att131,Att143": ps.parseAcademicRecordAttendance,
  CERTREQUESTSDATE: ps.parseCertRequests,
  "CORRESPONDENCE1,CORRESPONDENCE2,CORRESPONDENCE3,CORRESPONDENCE4": ps.parseCorrespondence,
  CURRENTLEVEL: ps.parseCurrentLevel,
  CURRENTSTATUS: ps.parseCurrentStatus,
  "Cert,Cert42,Cert55,Cert68,Cert81,Cert94,Cert107,Cert120": ps.parseAcademicRecordCertificate,
  DATESENT: ps.parseClassListSentDate,
  EnglishTeacher: ps.parseEnglishTeacher,
  "ExitSpeakingExamPF,ExitSpeakingExamPF39,ExitSpeakingExamPF52,ExitSpeakingExamPF65,ExitSpeakingExamPF78,ExitSpeakingExamPF91,ExitSpeakingExamPF104,ExitSpeakingExamPF117,ExitSpeakingExamPF130,ExitSpeakingExamPF142":
    ps.parseAcademicRecordExitSpeakingExam,
  "ExitWritingExamPF,ExitWritingExamPF38,ExitWritingExamPF51,ExitWritingExamPF64,ExitWritingExamPF77,ExitWritingExamPF90,ExitWritingExamPF103,ExitWritingExamPF116,ExitWritingExamPF129,ExitWritingExamPF141":
    ps.parseAcademicRecordExitWritingExam,
  "FAI17,FAII17,SPI18,SPII18,FAI18,FAII18,SPI19,SPII19,FAI19,FAII19,SPI20,SPII20,FAI20,FAII20,SPI21,FAI21,FAII21,SPI22,SPII22,FAI22,FAII22":
    ps.parseInitialSession,
  FGRDATE: ps.parseFgrDate,
  "FinalGrades,FinalGrades37,FinalGrades50,FinalGrades63,FinalGrades76,FinalGrades89,FinalGrades102,FinalGrades115,FinalGrades128,FinalGrades140":
    ps.parseAcademicRecordFinalGrade,
  ID: ps.parseID,
  IfELTPubschlprivschlunivorrefgcamp: ps.parseEnglishTeacherLocation,
  IlliterateAR: ps.parseArabicLiteracy,
  IlliterateENG: ps.parseEnglishLiteracy,
  "JRD,SYR,IRQ,EGY,INDNES,YEM,CEAFRRE,CHI,KOR,UNKNWN": ps.parseNationality,
  LEVELREVEALDATE: ps.parseLevelRevealDate,
  "LackofChildCare,LackofTransport,TimeConflict,IllnessorPregnancy,VisionProblems,GotaJob,Moved,GraduatedfromL5,FailedtoThriveinClsrmEnv,LackofLifeMgmSkills,LackofFamilialSupport,LackofCommitmentorMotivation,FamilyMemberorEmployerForbidFurtherStudy,COVID19PandemicRelated,Unknown":
    ps.parseDropoutReason,
  "LevelAttended,LevelAttended32,LevelAttended45,LevelAttended58,LevelAttended71,LevelAttended84,LevelAttended97,LevelAttended110,LevelAttended123,LevelAttended135":
    ps.parseAcademicRecordLevel,
  "LevelAudited,LevelAudited33,LevelAudited46,LevelAudited59,LevelAudited72,LevelAudited85,LevelAudited98,LevelAudited111,LevelAudited124,LevelAudited136":
    ps.parseAcademicRecordAudit,
  LookingforaJobDate: ps.parseLookingForJob,
  M: ps.parseGender,
  NACSWPM: ps.parseNoAnswerClassSchedule,
  NAMEAR: ps.parseArabicName,
  NAMEENG: ps.parseEnglishName,
  NCL: ps.parseNCL,
  NOTIFIED: ps.parseNotified,
  OCCUPATION: ps.parseOccupation,
  "P,P34,P47,P60,P73,P86,P99,P112,P125,P137,F28,F35,F48,F61,F74,F87,F100,F113,F126,F138,WD29,WD36,WD49,WD62,WD75,WD88,WD101,WD114,WD127,WD139":
    ps.parseAcademicRecordResult,
  PENDINGPLCM: ps.parsePendingPlacement,
  "PHONE,PHONE19,PHONE20,PHONE21,PHONE22,PHONE23": ps.parsePhone,
  PHOTOCONTACT: ps.parsePhotoContact,
  PLCMCONFDATE: ps.parsePlacementConfDate,
  PLCMLVL: ps.parseOrigPlacementLevel,
  PLCMNOCONTACT: ps.parsePlacement,
  REACTIVATEDDATE: ps.parseReactivatedDate,
  SECSOFFERED: ps.parseSectionsOffered,
  SENTTEXTEDCL: ps.parseClassListSent,
  SPKG: ps.parseOrigPlacementSpeaking,
  "Ses,Ses31,Ses44,Ses57,Ses70,Ses83,Ses96,Ses109,Ses122,Ses134": ps.parseAcademicRecordSession,
  "TeacherComments,TeacherComments41,TeacherComments54,TeacherComments67,TeacherComments80,TeacherComments93,TeacherComments106,TeacherComments119,TeacherComments132,TeacherComments144":
    ps.parseAcademicRecordTeacherComments,
  TeacherorProfessor: ps.parseTeacher,
  TeachingSubjectAreas: ps.parseTeachingSubjectAreas,
  TutorClubDetails: ps.parseZoomTutor,
  TutorDate: ps.parseLiteracyTutor,
  WABCSAR: ps.parseWABroadcastSAR,
  "WABCSARL35W,WABCSAREngTchrs,WABCSAREngTchrsL35,WABCPhotography,WABCGerman": ps.parseWABroadcasts,
  WAPRIMPHONE: ps.parseWaPrimPhone,
  WASTATUS: ps.parseWAStatus,
  WDDATE: ps.parseWithdrawDate,
  WRTG: ps.parseOrigPlacementWriting,
  Y: ps.parseInviteTag,
});

export const spreadsheetToStudentList = (csvString: string): Student[] => {
  // Remove junk and title rows from Excel export to CSV
  const csvStringClean = join(
    slice(replace(replace(csvString, "ï»¿", ""), "\t", ",").split("\n"), 3),
    "\n",
  );
  const objects: papa.ParseResult<never> = papa.parse(csvStringClean, {
    header: true,
    skipEmptyLines: "greedy",
  });

  const students: Student[] = [];

  const { data, meta } = objects;
  const { fields } = meta;
  // Parse each row of the CSV as an object
  data.forEach((object) => {
    const student = cloneDeep(emptyStudent);

    // Iterate through the fields of the CSV, and parse their values for this object
    if (fields) {
      fields.forEach((field) => {
        const value = String(object[field]);
        const fieldClean = replace(field, fieldCleanRegex, "");
        if (fieldClean in studentFields) {
          studentFields[fieldClean as keyof ValidFields](field, value, student);
        }
      });
      // student.phone.primaryPhone = indexOf(
      //   map(student.phone.phoneNumbers, "number"),
      //   student.phone.primaryPhone,
      // );
      student.epId !== 0 && students.push(student);
    }
  });
  return students;
};
