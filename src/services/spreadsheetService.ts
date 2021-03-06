import { cloneDeep, find, forEach, isEqual, join, map, omit, replace, slice, sortBy } from "lodash";
import papa from "papaparse";
import { emptyStudent, Student } from "../interfaces";
import { covidVaccineImageFolder, studentImageFolder } from "./firebaseService";
import * as ps from "./parsingService";
import { setImages, setStudentData } from "./studentDataService";

export interface ValidFields {
  [key: string]: (key: string, value: string, student: Student) => void;
}

const searchForImages = true;
const fieldCleanRegex = /[\s)(\-#/+:,;&%'◄]/g;

const studentFieldsUnexpanded: ValidFields = {
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
studentFieldsUnexpanded[ps.generateKeys("PHONE", 50)] = ps.parsePhone;
studentFieldsUnexpanded[ps.generateKeys("Ses", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordSession;
studentFieldsUnexpanded[ps.generateKeys("TeacherComments", maxAcademicRecordColumnNum)] =
  ps.parseAcademicRecordTeacherComments;
const studentFields = ps.expand(studentFieldsUnexpanded);

export const spreadsheetToStudentList = async (
  csvString: string,
  currentStudents: Student[],
): Promise<Student[]> => {
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
  forEach(data, (object) => {
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
        await setStudentData(student, { merge: true });
      }
    }),
  );
  return sortBy(students, "name.english");
};
