import { cloneDeep, join, replace, slice, split } from "lodash";
import papa from "papaparse";
import { emptyStudent, Student } from "../interfaces";
import * as ps from "./parsingService";

export interface ValidFields {
  [key: string]: (key: string, value: string, student: Student) => void;
}

const fieldCleanRegex = /[\s)(-#/+:,;&%]/g; // /\s|(|)|-|#|\/|+|:|,|;|&|%/g;

const studentFields: ValidFields = ps.expand({
  ADJ: ps.parseOrigPlacementAdjustment,
  AGE: ps.parseAge,
  AUD: ps.parseAudit,
  CERTREQUESTSDATE: ps.parseCertRequests,
  "CORRESPONDENCE1,CORRESPONDENCE2,CORRESPONDENCE3,CORRESPONDENCE4": ps.parseCorrespondence,
  CURRENTLEVEL: ps.parseCurrentLevel,
  CURRENTSTATUS: ps.parseCurrentStatus,
  DATESENT: ps.parseClassListSentDate,
  EnglishTeacher: ps.parseEnglishTeacher,
  "FAI17,FAII17,SPI18,SPII18,FAI18,FAII18,SPI19,SPII19,FAI19,FAII19,SPI20,SPII20,FAI20,FAII20,SPI21,FAI21,FAII21,SPI22,SPII22,FAI22,FAII22":
    ps.parseInitialSession,
  FGRDATE: ps.parseFgrDate,
  ID: ps.parseID,
  IfELTPubschlprivschlunivorrefgcamp: ps.parseEnglishTeacherLocation,
  IlliterateAR: ps.parseArabicLiteracy,
  IlliterateENG: ps.parseEnglishLiteracy,
  "JRD,SYR,IRQ,EGY,INDNES,YEM,CEAFRRE,CHI,KOR,UNKNWN": ps.parseNationality,
  LEVELREVEALDATE: ps.parseLevelRevealDate,
  "LackofChildCare,LackofTransport,TimeConflict,IllnessorPregnancy,VisionProblems,GotaJob,Moved,GraduatedfromL5,FailedtoThriveinClsrmEnv,LackofLifeMgmSkills,LackofFamilialSupport,LackofCommitmentorMotivation,FamilyMemberorEmployerForbidFurtherStudy,COVID19PandemicRelated,Unknown":
    ps.parseDropoutReason,
  LookingforaJobDate: ps.parseLookingForJob,
  M: ps.parseGender,
  NACSWPM: ps.parseNoAnswerClassSchedule,
  NAMEAR: ps.parseArabicName,
  NAMEENG: ps.parseEnglishName,
  NCL: ps.parseNCL,
  NOTIFIED: ps.parseNotified,
  OCCUPATION: ps.parseOccupation,
  PENDINGPLCM: ps.parsePendingPlacement,
  PHONE: ps.parsePhone,
  PHOTOCONTACT: ps.parsePhotoContact,
  PLCMCONFDATE: ps.parsePlacementConfDate,
  PLCMLVL: ps.parseOrigPlacementLevel,
  PLCMNOCONTACT: ps.parsePlacement,
  REACTIVATEDDATE: ps.parseReactivatedDate,
  SECSOFFERED: ps.parseSectionsOffered,
  SENTTEXTEDCL: ps.parseClassListSent,
  SPKG: ps.parseOrigPlacementSpeaking,
  TeacherorProfessor: ps.parseTeacher,
  TeachingSubjectAreas: ps.parseTeachingSubjectAreas,
  TutorClubDetails: ps.parseZoomTutor,
  TutorDate: ps.parseLiteracyTutor,
  WABCSAR: ps.parseWABroadcastSAR,
  "WABCSARL35W,WABCSAREngTchrs,WABCSAREngTchrsL3-5,WABCPhotography,WABCGerman":
    ps.parseWABroadcasts,
  WAPRIMPHONE: ps.parseWaPrimPhone,
  WASTATUS: ps.parseWAStatus,
  WDDATE: ps.parseWithdrawDate,
  WRTG: ps.parseOrigPlacementWriting,
  Y: ps.parseInviteTag,
});

export const spreadsheetToStudentList = (csvString: string): Student[] => {
  // Remove junk and title rows from Excel export to CSV
  const csvStringClean = join(slice(split(replace(csvString, "ï»¿", ""), "/n"), 3), "\n");

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

      students.push(student);
    }
  });
  return students;
};
