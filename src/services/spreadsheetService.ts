import { cloneDeep, join, replace, slice } from "lodash";
import papa from "papaparse";
import { emptyStudent, Student } from "../interfaces";
import * as ps from "./parsingService";

export interface ValidFields {
  [key: string]: (key: string, value: string, student: Student) => void;
}

const fieldCleanRegex = /[\s)(\-#/+:,;&%'◄]/g; // /\s|(|)|-|#|\/|+|:|,|;|&|%/g;

const studentFieldsUnexpanded: ValidFields = {
  ADJ: ps.parseOrigPlacementAdjustment,
  AGEATPROGENTRY: ps.parseAge,
  AUD: ps.parseAudit,
  CERTREQUESTSDATE: ps.parseCertRequests,
  CURRENTLEVEL: ps.parseCurrentLevel,
  CURRENTSTATUS: ps.parseCurrentStatus,
  DATESENT: ps.parseClassScheduleSentDate,
  EnglishTeacher: ps.parseEnglishTeacher,
  "FAI17,FAII17,SPI18,SPII18,FAI18,FAII18,SPI19,SPII19,FAI19,FAII19,SPI20,SPII20,FAI20,FAII20,SPI21,FAI21,FAII21,SPI22,SPII22,FAI22,FAII22":
    ps.parseInitialSession,
  FAMCOORNAMEOFENTRY: ps.parseFamilyCoordinator,
  FGRDATE: ps.parseFgrDate,
  ID: ps.parseID,
  IfELTPubschlprivschlunivorrefgcamp: ps.parseEnglishTeacherLocation,
  IlliterateAR: ps.parseArabicLiteracy,
  IlliterateENG: ps.parseEnglishLiteracy,
  "JDN,SYR,IRQ,EGY,INDNES,YEM,CEAFRRE,CHI,KOR,UNKNWN": ps.parseNationality,
  "JORDANIANUNVACCD,SYRIANUNVACCD,OTHERNATIONALITYUNVACCD,JORDANIANPARTIALLYVACCD,SYRIANPARTIALLYVACCD,OTHERNATIONALITYPARTIALLYVACCD,JORDANIANFULLYVACCD,SYRIANFULLYVACCD,OTHERNATIONALITYFULLYVACCD,EXEMPTFROMVACCINE,BOOSTERTHIRDDOSE,ANSWEREDBUTANSWERUNCLEAR,DECLINEDTOPROVIDEVACCINEINFO":
    ps.parseCovidStatus,
  LEVELREEVALDATE: ps.parseLevelReevalDate,
  "LackofChildCare,LackofTransport,TimeConflict,IllnessorPregnancy,VisionProblems,GotaJob,Moved,GraduatedfromL5,FailedtoThriveinClsrmEnv,LackofLifeMgmSkills,LackofFamilialSupport,LackofCommitmentorMotivation,FamilyMemberorEmployerForbidFurtherStudy,COVID19PandemicRelated,Unknown":
    ps.parseDropoutReason,
  LookingforaJobDate: ps.parseLookingForJob,
  M: ps.parseGender,
  NACSWPM: ps.parseNoAnswerClassSchedule,
  NAMEAR: ps.parseArabicName,
  NAMEENG: ps.parseEnglishName,
  NCL: ps.parseNCL,
  OCCUPATION: ps.parseOccupation,
  PENDINGPLCM: ps.parsePendingPlacement,
  PHOTOCONTACT: ps.parsePhotoContact,
  PLCM: ps.parsePlacement,
  PLCMCONFDATE: ps.parsePlacementConfDate,
  PLCMLVL: ps.parseOrigPlacementLevel,
  REACTIVATEDDATE: ps.parseReactivatedDate,
  REASONFOREXEMPTION: ps.parseCovidReason,
  REASONFORSUSPECTEDVACCINEFRAUD: ps.parseCovidSuspectedFraudReason,
  SECSOFFERED: ps.parseSectionsOffered,
  SPKG: ps.parseOrigPlacementSpeaking,
  SUSPECTEDVACCINEFRAUD: ps.parseCovidSuspectedFraud,
  TeacherorProfessor: ps.parseTeacher,
  TeachingSubjectAreas: ps.parseTeachingSubjectAreas,
  TutorClubDetails: ps.parseZoomTutor,
  TutorDate: ps.parseLiteracyTutor,
  WA: ps.parseWaPrimPhone,
  WABCSAR: ps.parseWABroadcastSAR,
  "WABCSARL35W,WABCSAREngTchrs,WABCSAREngTchrsL35,WABCPhotography,WABCGerman": ps.parseWABroadcasts,
  WDDATE: ps.parseWithdrawDate,
  WRTG: ps.parseOrigPlacementWriting,
  Y: ps.parseInviteTag,
};
const maxAcademicRecordColumnNum = 200;
studentFieldsUnexpanded[ps.generateKeys("CORRESPONDENCE", 10)] = ps.parseCorrespondence;
studentFieldsUnexpanded[ps.generateKeys("DATE", 100)] = ps.parseCovidDate;
studentFieldsUnexpanded[ps.generateKeys("REASONGIVENUNVACCD", 100)] = ps.parseCovidReason;
studentFieldsUnexpanded[ps.generateKeys("Att", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordAttendance;
studentFieldsUnexpanded[ps.generateKeys("ExitSpeakingExamPF", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordExitSpeakingExam;
studentFieldsUnexpanded[ps.generateKeys("ExitWritingExamPF", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordExitWritingExam;
studentFieldsUnexpanded[ps.generateKeys("FinalGrades", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordFinalGrade;
studentFieldsUnexpanded[ps.generateKeys("LevelAttended", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordLevel;
studentFieldsUnexpanded[ps.generateKeys("ElectiveClassAttended", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordLevel;
studentFieldsUnexpanded[ps.generateKeys("LevelAudited", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordAudit;
studentFieldsUnexpanded[ps.generateKeys("P", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordResult;
studentFieldsUnexpanded[ps.generateKeys("F", maxAcademicRecordColumnNum, true)] = ps.parseAcademicRecordResult;
studentFieldsUnexpanded[ps.generateKeys("WD", maxAcademicRecordColumnNum, true)] = ps.parseAcademicRecordResult;
studentFieldsUnexpanded[ps.generateKeys("PHONE", 50)] = ps.parsePhone;
studentFieldsUnexpanded[ps.generateKeys("Ses", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordSession;
studentFieldsUnexpanded[ps.generateKeys("TeacherComments", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordTeacherComments;
const studentFields = ps.expand(studentFieldsUnexpanded);

export const spreadsheetToStudentList = (csvString: string): Student[] => {
  // Remove junk and title rows from Excel export to CSV
  const csvStringClean = join(slice(replace(replace(csvString, "ï»¿", ""), "\t", ",").split("\n"), 3), "\n");
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
      student.epId !== 0 && students.push(student);
    }
  });
  return students;
};
