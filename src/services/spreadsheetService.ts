import {
  cloneDeep,
  filter,
  find,
  first,
  forEach,
  get,
  isEqual,
  join,
  map,
  omit,
  replace,
  slice,
  sortBy,
} from "lodash";
import papa from "papaparse";
import { v4 } from "uuid";
import { emptyStudent, emptyWaitingListEntry, Student, WaitingListEntry } from "../interfaces";
import { deleteCollection, setData, setImages } from "./dataService";
import { covidVaccineImageFolder, studentImageFolder } from "./firebaseService";
import * as ps from "./studentParsingService";
import * as wlps from "./waitingListParsingService";
import { sortWaitingList } from "./waitingListService";

export interface ValidFields<T> {
  [key: string]: (key: string, value: string, object: T) => void;
}

const fieldCleanRegex = /[\s)(\-#/+:,;→&%'◄?+]/g;

export const spreadsheetToList = <T>(
  csvString: string,
  TFields: ValidFields<T>,
  emptyT: T,
  numSkipLines?: number,
) => {
  // Remove junk and title rows from Excel export to CSV
  const csvStringClean = join(
    slice(replace(replace(csvString, "ï»¿", ""), "\t", ",").split("\n"), numSkipLines || 0),
    "\n",
  );
  const objects: papa.ParseResult<never> = papa.parse(csvStringClean, {
    header: true,
    skipEmptyLines: "greedy",
  });

  const TList: T[] = [];

  const { data, meta } = objects;
  const { fields } = meta;
  // Parse each row of the CSV as an object
  forEach(data, (object) => {
    const newObject = cloneDeep(emptyT);

    // Iterate through the fields of the CSV, and parse their values for this object
    if (fields) {
      fields.forEach((field) => {
        const value = String(object[field]);
        const fieldClean = replace(field, fieldCleanRegex, "");
        if (fieldClean in TFields) {
          get(TFields, fieldClean)(field, value, newObject);
        }
      });
      TList.push(newObject);
    }
  });
  return TList;
};

const studentFieldsUnexpanded: ValidFields<Student> = {
  ADJ: ps.parseOrigPlacementAdjustment,
  AGEATPROGENTRY: ps.parseAge,
  CERTREQUESTSDATE: ps.parseCertRequests,
  CHEATEDONASSM3xout: ps.parseCheatingSessions,
  CURRENTLEVEL: ps.parseCurrentLevel,
  CURRENTSTATUS: ps.parseCurrentStatus,
  EnglishTeacher: ps.parseEnglishTeacher,
  "FAI17,FAII17,SPI18,SPII18,FAI18,FAII18,SPI19,SPII19,FAI19,FAII19,SPI20,SPII20,FAI20,FAII20,SPI21,FAI21,FAII21,SPI22,SPII22,FAI22,FAII22":
    ps.parseInitialSession,
  FAMCOORNAMEOFENTRY: ps.parseFamilyCoordinator,
  ID: ps.parseID,
  IfELTPubschlprivschlunivorrefgcamp: ps.parseEnglishTeacherLocation,
  IlliterateAR: ps.parseArabicLiteracy,
  IlliterateENG: ps.parseEnglishLiteracy,
  "JDN,SYR,IRQ,EGY,INDNES,YEM,CEAFRRE,CHI,KOR,UNKNWN": ps.parseNationality,
  "JORDANIANUNVACCD,SYRIANUNVACCD,OTHERNATIONALITYUNVACCD,JORDANIANPARTIALLYVACCD,SYRIANPARTIALLYVACCD,OTHERNATIONALITYPARTIALLYVACCD,JORDANIANFULLYVACCD,SYRIANFULLYVACCD,OTHERNATIONALITYFULLYVACCD,EXEMPTFROMVACCINE,BOOSTERTHIRDDOSE,ANSWEREDBUTANSWERUNCLEAR,DECLINEDTOPROVIDEVACCINEINFO,VEXEMPT":
    ps.parseCovidStatus,
  "LackofChildCare,LackofTransport,TimeConflict,IllnessorPregnancy,VisionProblems,GotaJob,Moved,GraduatedfromL5,FailedtoThriveinClsrmEnv,LackofLifeMgmSkills,LackofFamilialSupport,LackofCommitmentorMotivation,FamilyMemberorEmployerForbidFurtherStudy,COVID19PandemicRelated,Unknown":
    ps.parseDropoutReason,
  LookingforaJobDate: ps.parseLookingForJob,
  M: ps.parseGender,
  NAMEAR: ps.parseArabicName,
  NAMEENG: ps.parseEnglishName,
  NCL: ps.parseNCL,
  OCCUPATION: ps.parseOccupation,
  PHOTOCONTACT: ps.parsePhotoContact,
  PLCMLVL: ps.parseOrigPlacementLevel,
  REACTIVATEDDATE: ps.parseReactivatedDate,
  REASONFOREXEMPTION: ps.parseCovidReason,
  REASONFORSUSPECTEDVACCINEFRAUD: ps.parseCovidSuspectedFraudReason,
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
studentFieldsUnexpanded[ps.generateKeys("PHONE", 50)] = ps.parseStudentPhone;
studentFieldsUnexpanded[ps.generateKeys("Ses", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordSession;
studentFieldsUnexpanded[ps.generateKeys("TeacherComments", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordTeacherComments;
const studentFields = ps.expand(studentFieldsUnexpanded);

const searchForImages = false;

export const spreadsheetToStudentList = async (
  csvString: string,
  currentStudents: Student[],
): Promise<Student[]> => {
  const students = filter(spreadsheetToList(csvString, studentFields, emptyStudent, 3), (s) => {
    return s.epId !== 0;
  });

  const studentsWithImage = searchForImages
    ? await setImages(students, "imageName", studentImageFolder)
    : students;
  const studentsWithVaccineImage = searchForImages
    ? await setImages(studentsWithImage, "covidVaccine.imageName", covidVaccineImageFolder)
    : students;

  await Promise.all(
    map(studentsWithVaccineImage, async (student) => {
      const currentStudent = find(currentStudents, { epId: student.epId });
      if (
        !isEqual(
          searchForImages ? currentStudent : omit(currentStudent, ["imageName", "covidVaccine.imageName"]),
          student,
        )
      ) {
        await setData(student, "students", "epId", { merge: true });
      }
    }),
  );
  return sortBy(students, "name.english");
};

const waitlistFieldsUnexpanded: ValidFields<WaitingListEntry> = {
  CORRESPONDENCEDONOTDELETE: ps.parseCorrespondence,
  EntryDate: wlps.parseWLEntryDate,
  HIGHPRIORITY: wlps.parseWLHighPriority,
  "NA,NS,WDUNC,N": wlps.parseWLOutcome,
  NameOptional: wlps.parseWLName,
  PE: wlps.parseWLPlacementExam,
  PhoneYN: wlps.parseWLEnteredInPhone,
  "Prim,Sec,Other": wlps.parseWLPhone,
  ProbL3: wlps.parseWLProbL3Plus,
  ProbPL1: wlps.parseWLProbPL1,
  ReferralOptional: wlps.parseWLReferral,
  TransferralToDate: wlps.parseWLTransferralAndDate,
  VCCode: wlps.parseWLCovidVaccineStatus,
  VCinWA: wlps.parseWLCovidVaccineNotes,
  Waiting: wlps.parseWLWaiting,
};
const waitlistFields = ps.expand(waitlistFieldsUnexpanded);

export const waitingListToList = async (csvString: string) => {
  const newWaitingList = spreadsheetToList(csvString, waitlistFields, emptyWaitingListEntry, 1);
  forEach(newWaitingList, (nwlEntry) => {
    forEach(nwlEntry.correspondence, (c) => {
      if (c.date === null) c.date = nwlEntry.entryDate;
    });
    nwlEntry.primaryPhone = first(nwlEntry.phoneNumbers)?.number || -1;
    nwlEntry.id = v4();
  });

  await deleteCollection("waitingList");
  await Promise.all(
    map(newWaitingList, async (nwlEntry) => {
      await setData(nwlEntry, "waitingList", "id", { merge: true });
    }),
  );
  return sortWaitingList(newWaitingList);
};
