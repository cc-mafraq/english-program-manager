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
  "Att,Att42,Att55,Att68,Att81,Att94,Att107,Att120,Att133,Att146,Att159,Att172,Att185": ps.parseAcademicRecordAttendance,
  CERTREQUESTSDATE: ps.parseCertRequests,
  "CORRESPONDENCE1,CORRESPONDENCE2,CORRESPONDENCE3,CORRESPONDENCE4": ps.parseCorrespondence,
  CURRENTLEVEL: ps.parseCurrentLevel,
  CURRENTSTATUS: ps.parseCurrentStatus,
  "Cert,Cert44,Cert57,Cert70,Cert83,Cert96,Cert109,Cert122,Cert135,Cert148,Cert161,Cert174": ps.parseAcademicRecordCertificate,
  DATESENT: ps.parseClassListSentDate,
  EnglishTeacher: ps.parseEnglishTeacher,
  "ExitSpeakingExamPF,ExitSpeakingExamPF41,ExitSpeakingExamPF54,ExitSpeakingExamPF67,ExitSpeakingExamPF80,ExitSpeakingExamPF93,ExitSpeakingExamPF106,ExitSpeakingExamPF119,ExitSpeakingExamPF132,ExitSpeakingExamPF145,ExitSpeakingExamPF158,ExitSpeakingExamPF171,ExitSpeakingExamPF184":
    ps.parseAcademicRecordExitSpeakingExam,
  "ExitWritingExamPF,ExitWritingExamPF40,ExitWritingExamPF53,ExitWritingExamPF66,ExitWritingExamPF79,ExitWritingExamPF92,ExitWritingExamPF105,ExitWritingExamPF118,ExitWritingExamPF131,ExitWritingExamPF144,ExitWritingExamPF157,ExitWritingExamPF170,ExitWritingExamPF183":
    ps.parseAcademicRecordExitWritingExam,
  "FAI17,FAII17,SPI18,SPII18,FAI18,FAII18,SPI19,SPII19,FAI19,FAII19,SPI20,SPII20,FAI20,FAII20,SPI21,FAI21,FAII21,SPI22,SPII22,FAI22,FAII22":
    ps.parseInitialSession,
  FGRDATE: ps.parseFgrDate,
  "FinalGrades,FinalGrades39,FinalGrades52,FinalGrades65,FinalGrades78,FinalGrades91,FinalGrades104,FinalGrades117,FinalGrades130,FinalGrades143,FinalGrades156,FinalGrades169":
    ps.parseAcademicRecordFinalGrade,
  ID: ps.parseID,
  IfELTPubschlprivschlunivorrefgcamp: ps.parseEnglishTeacherLocation,
  IlliterateAR: ps.parseArabicLiteracy,
  IlliterateENG: ps.parseEnglishLiteracy,
  "JRD,SYR,IRQ,EGY,INDNES,YEM,CEAFRRE,CHI,KOR,UNKNWN": ps.parseNationality,
  LEVELREVEALDATE: ps.parseLevelRevealDate,
  "LackofChildCare,LackofTransport,TimeConflict,IllnessorPregnancy,VisionProblems,GotaJob,Moved,GraduatedfromL5,FailedtoThriveinClsrmEnv,LackofLifeMgmSkills,LackofFamilialSupport,LackofCommitmentorMotivation,FamilyMemberorEmployerForbidFurtherStudy,COVID19PandemicRelated,Unknown":
    ps.parseDropoutReason,
  "LevelAttended,LevelAttended34,LevelAttended47,LevelAttended60,LevelAttended73,LevelAttended86,LevelAttended99,LevelAttended112,LevelAttended125,LevelAttended138,LevelAttended151,LevelAttended164,LevelAttended177":
    ps.parseAcademicRecordLevel,
  "LevelAudited,LevelAudited35,LevelAudited48,LevelAudited61,LevelAudited74,LevelAudited87,LevelAudited100,LevelAudited113,LevelAudited126,LevelAudited139,LevelAudited152,LevelAudited165,LevelAudited178":
    ps.parseAcademicRecordAudit,
  LookingforaJobDate: ps.parseLookingForJob,
  M: ps.parseGender,
  NACSWPM: ps.parseNoAnswerClassSchedule,
  NAMEAR: ps.parseArabicName,
  NAMEENG: ps.parseEnglishName,
  NCL: ps.parseNCL,
  NOTIFIED: ps.parseNotified,
  OCCUPATION: ps.parseOccupation,
  "P,P36,P49,P62,P75,P88,P101,P114,P127,P140,P153,P166,P179,F30,F37,F50,F63,F76,F89,F102,F115,F128,F141,F154,F167,F180,WD31,WD38,WD51,WD64,WD77,WD90,WD103,WD116,WD129,WD142,WD155,WD168,WD181":
    ps.parseAcademicRecordResult,
  PENDINGPLCM: ps.parsePendingPlacement,
  "PHONE,PHONE20,PHONE21,PHONE22,PHONE23,PHONE24,PHONE25": ps.parsePhone,
  PHOTOCONTACT: ps.parsePhotoContact,
  PLCMCONFDATE: ps.parsePlacementConfDate,
  PLCMLVL: ps.parseOrigPlacementLevel,
  PLCMNOCONTACT: ps.parsePlacement,
  REACTIVATEDDATE: ps.parseReactivatedDate,
  SECSOFFERED: ps.parseSectionsOffered,
  SENTTEXTEDCL: ps.parseClassListSent,
  SPKG: ps.parseOrigPlacementSpeaking,
  "Ses,Ses33,Ses46,Ses59,Ses72,Ses85,Ses98,Ses111,Ses124,Ses137,Ses150,Ses163,Ses176": ps.parseAcademicRecordSession,
  "TeacherComments,TeacherComments43,TeacherComments56,TeacherComments69,TeacherComments82,TeacherComments95,TeacherComments108,TeacherComments121,TeacherComments134,TeacherComments147,TeacherComments160,TeacherComments173,TeacherComments186":
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
