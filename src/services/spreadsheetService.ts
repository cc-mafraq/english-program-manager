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
  "Att1,Att2,Att3,Att4,Att5,Att6,Att7,Att8,Att9,Att10": ps.parseAcademicRecordAttendance,
  CERTREQUESTSDATE: ps.parseCertRequests,
  "CORRESPONDENCE1,CORRESPONDENCE2,CORRESPONDENCE3,CORRESPONDENCE4": ps.parseCorrespondence,
  CURRENTLEVEL: ps.parseCurrentLevel,
  CURRENTSTATUS: ps.parseCurrentStatus,
  "Cert1,Cert2,Cert3,Cert4,Cert5,Cert6,Cert7,Cert8,Cert9,Cert10": ps.parseAcademicRecordCertificate,
  DATESENT: ps.parseClassListSentDate,
  EnglishTeacher: ps.parseEnglishTeacher,
  "ExitSpeakingExamPF1,ExitSpeakingExamPF2,ExitSpeakingExamPF3,ExitSpeakingExamPF4,ExitSpeakingExamPF5,ExitSpeakingExamPF6,ExitSpeakingExamPF7,ExitSpeakingExamPF8,ExitSpeakingExamPF9,ExitSpeakingExamPF10":
    ps.parseAcademicRecordExitSpeakingExam,
  "ExitWritingExamPF1,ExitWritingExamPF2,ExitWritingExamPF3,ExitWritingExamPF4,ExitWritingExamPF5,ExitWritingExamPF6,ExitWritingExamPF7,ExitWritingExamPF8,ExitWritingExamPF9,ExitWritingExamPF10":
    ps.parseAcademicRecordExitWritingExam,
  "FAI17,FAII17,SPI18,SPII18,FAI18,FAII18,SPI19,SPII19,FAI19,FAII19,SPI20,SPII20,FAI20,FAII20,SPI21,FAI21,FAII21,SPI22,SPII22,FAI22,FAII22":
    ps.parseInitialSession,
  FGRDATE: ps.parseFgrDate,
  "FinalGrades1,FinalGrades2,FinalGrades3,FinalGrades4,FinalGrades5,FinalGrades6,FinalGrades7,FinalGrades8,FinalGrades9,FinalGrades10":
    ps.parseAcademicRecordFinalGrade,
  ID: ps.parseID,
  IfELTPubschlprivschlunivorrefgcamp: ps.parseEnglishTeacherLocation,
  IlliterateAR: ps.parseArabicLiteracy,
  IlliterateENG: ps.parseEnglishLiteracy,
  "JRD,SYR,IRQ,EGY,INDNES,YEM,CEAFRRE,CHI,KOR,UNKNWN": ps.parseNationality,
  LEVELREVEALDATE: ps.parseLevelRevealDate,
  "LackofChildCare,LackofTransport,TimeConflict,IllnessorPregnancy,VisionProblems,GotaJob,Moved,GraduatedfromL5,FailedtoThriveinClsrmEnv,LackofLifeMgmSkills,LackofFamilialSupport,LackofCommitmentorMotivation,FamilyMemberorEmployerForbidFurtherStudy,COVID19PandemicRelated,Unknown":
    ps.parseDropoutReason,
  "LevelAttended1,LevelAttended2,LevelAttended3,LevelAttended4,LevelAttended5,LevelAttended6,LevelAttended7,LevelAttended8,LevelAttended9,LevelAttended10":
    ps.parseAcademicRecordLevel,
  "LevelAudited1,LevelAudited2,LevelAudited3,LevelAudited4,LevelAudited5,LevelAudited6,LevelAudited7,LevelAudited8,LevelAudited9,LevelAudited10":
    ps.parseAcademicRecordAudit,
  LookingforaJobDate: ps.parseLookingForJob,
  M: ps.parseGender,
  NACSWPM: ps.parseNoAnswerClassSchedule,
  NAMEAR: ps.parseArabicName,
  NAMEENG: ps.parseEnglishName,
  NCL: ps.parseNCL,
  NOTIFIED: ps.parseNotified,
  OCCUPATION: ps.parseOccupation,
  "P1,P2,P3,P4,P5,P6,P7,P8,P9,P10,F1,F2,F3,F4,F5,F6,F7,F8,F9,F10,WD1,WD2,WD3,WD4,WD5,WD6,WD7,WD8,WD9,WD10":
    ps.parseAcademicRecordResult,
  PENDINGPLCM: ps.parsePendingPlacement,
  "PHONE1,PHONE2,PHONE3,PHONE4,PHONE5,PHONE6": ps.parsePhone,
  PHOTOCONTACT: ps.parsePhotoContact,
  PLCMCONFDATE: ps.parsePlacementConfDate,
  PLCMLVL: ps.parseOrigPlacementLevel,
  PLCMNOCONTACT: ps.parsePlacement,
  REACTIVATEDDATE: ps.parseReactivatedDate,
  SECSOFFERED: ps.parseSectionsOffered,
  SENTTEXTEDCL: ps.parseClassListSent,
  SPKG: ps.parseOrigPlacementSpeaking,
  "Ses1,Ses2,Ses3,Ses4,Ses5,Ses6,Ses7,Ses8,Ses9,Ses10": ps.parseAcademicRecordSession,
  "TeacherComments1,TeacherComments2,TeacherComments3,TeacherComments4,TeacherComments5,TeacherComments6,TeacherComments7,TeacherComments8,TeacherComments9,TeacherComments10":
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
  const csvStringClean = join(slice(replace(csvString, "ï»¿", "").split("\n"), 2), "\n");
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
