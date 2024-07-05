import {
  cloneDeep,
  filter,
  findIndex,
  first,
  forEach,
  get,
  includes,
  join,
  map,
  nth,
  replace,
  slice,
  sortBy,
  toLower,
} from "lodash";
import papa from "papaparse";
import { Status, Student, emptyStudent } from "../interfaces";
import { deleteCollection, setData } from "./dataService";
import * as ps from "./studentParsingService";
import { generateId, sortBySession, sortStudents } from "./studentService";

export interface ValidFields<T> {
  [key: string]: (key: string, value: string, object: T) => void;
}

const fieldCleanRegex = /[\s)(\-#/+:,;→&%'◄?+°/]/g;

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

// const studentFieldsUnexpanded: ValidFields<Student> = {
//   ADJ: ps.parseOrigPlacementAdjustment,
//   AGEATPROGENTRY: ps.parseAge,
//   CERTREQUESTSDATE: ps.parseCertRequests,
//   CHEATEDONASSM3xout: ps.parseCheatingSessions,
//   CURRENTLEVEL: ps.parseCurrentLevel,
//   CURRENTSTATUS: ps.parseCurrentStatus,
//   EnglishTeacher: ps.parseEnglishTeacher,
//   "FAI17,FAII17,SPI18,SPII18,FAI18,FAII18,SPI19,SPII19,FAI19,FAII19,SPI20,SPII20,FAI20,FAII20,SPI21,FAI21,FAII21,SPI22,SPII22,FAI22,FAII22":
//     ps.parseInitialSession,
//   FAMCOORNAMEOFENTRY: ps.parseFamilyCoordinator,
//   ID: ps.parseID,
//   IfELTPubschlprivschlunivorrefgcamp: ps.parseEnglishTeacherLocation,
//   IlliterateAR: ps.parseArabicLiteracy,
//   IlliterateENG: ps.parseEnglishLiteracy,
//   "JDN,SYR,IRQ,EGY,INDNES,YEM,CEAFRRE,CHI,KOR,UNKNWN": ps.parseNationality,
//   "JORDANIANUNVACCD,SYRIANUNVACCD,OTHERNATIONALITYUNVACCD,JORDANIANPARTIALLYVACCD,SYRIANPARTIALLYVACCD,OTHERNATIONALITYPARTIALLYVACCD,JORDANIANFULLYVACCD,SYRIANFULLYVACCD,OTHERNATIONALITYFULLYVACCD,EXEMPTFROMVACCINE,BOOSTERTHIRDDOSE,ANSWEREDBUTANSWERUNCLEAR,DECLINEDTOPROVIDEVACCINEINFO,VEXEMPT":
//     ps.parseCovidStatus,
//   "LackofChildCare,LackofTransport,TimeConflict,IllnessorPregnancy,VisionProblems,GotaJob,Moved,GraduatedfromL5,FailedtoThriveinClsrmEnv,LackofLifeMgmSkills,LackofFamilialSupport,LackofCommitmentorMotivation,FamilyMemberorEmployerForbidFurtherStudy,COVID19PandemicRelated,Unknown":
//     ps.parseDropoutReason,
//   LookingforaJobDate: ps.parseLookingForJob,
//   M: ps.parseGender,
//   NAMEAR: ps.parseArabicName,
//   NAMEENG: ps.parseEnglishName,
//   NCL: ps.parseNCL,
//   OCCUPATION: ps.parseOccupation,
//   PHOTOCONTACT: ps.parsePhotoContact,
//   PLCMLVL: ps.parseOrigPlacementLevel,
//   REACTIVATEDDATE: ps.parseReactivatedDate,
//   REASONFOREXEMPTION: ps.parseCovidReason,
//   REASONFORSUSPECTEDVACCINEFRAUD: ps.parseCovidSuspectedFraudReason,
//   SPKG: ps.parseOrigPlacementSpeaking,
//   SUSPECTEDVACCINEFRAUD: ps.parseCovidSuspectedFraud,
//   TeacherorProfessor: ps.parseTeacher,
//   TeachingSubjectAreas: ps.parseTeachingSubjectAreas,
//   TutorClubDetails: ps.parseZoomTutor,
//   TutorDate: ps.parseLiteracyTutor,
//   WA: ps.parseWaPrimPhone,
//   WABCSAR: ps.parseWABroadcastSAR,
//   "WABCSARL35W,WABCSAREngTchrs,WABCSAREngTchrsL35,WABCPhotography,WABCGerman": ps.parseWABroadcasts,
//   WDDATE: ps.parseWithdrawDate,
//   WRTG: ps.parseOrigPlacementWriting,
//   Y: ps.parseInviteTag,
// };
// const maxAcademicRecordColumnNum = 200;
// studentFieldsUnexpanded[ps.generateKeys("CORRESPONDENCE", 10)] = ps.parseCorrespondence;
// studentFieldsUnexpanded[ps.generateKeys("DATE", 100)] = ps.parseCovidDate;
// studentFieldsUnexpanded[ps.generateKeys("REASONGIVENUNVACCD", 100)] = ps.parseCovidReason;
// studentFieldsUnexpanded[ps.generateKeys("Att", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordAttendance;
// studentFieldsUnexpanded[ps.generateKeys("ExitSpeakingExamPF", maxAcademicRecordColumnNum)] =
//   ps.parseAcademicRecordExitSpeakingExam;
// studentFieldsUnexpanded[ps.generateKeys("ExitWritingExamPF", maxAcademicRecordColumnNum)] =
//   ps.parseAcademicRecordExitWritingExam;
// studentFieldsUnexpanded[ps.generateKeys("FinalGrades", maxAcademicRecordColumnNum)] =
//   ps.parseAcademicRecordFinalGrade;
// studentFieldsUnexpanded[ps.generateKeys("LevelAttended", maxAcademicRecordColumnNum)] =
//   ps.parseAcademicRecordLevel;
// studentFieldsUnexpanded[ps.generateKeys("ElectiveClassAttended", maxAcademicRecordColumnNum)] =
//   ps.parseAcademicRecordLevel;
// studentFieldsUnexpanded[ps.generateKeys("LevelAudited", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordAudit;
// studentFieldsUnexpanded[ps.generateKeys("P", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordResult;
// studentFieldsUnexpanded[ps.generateKeys("F", maxAcademicRecordColumnNum, true)] = ps.parseAcademicRecordResult;
// studentFieldsUnexpanded[ps.generateKeys("WD", maxAcademicRecordColumnNum, true)] = ps.parseAcademicRecordResult;
// studentFieldsUnexpanded[ps.generateKeys("PHONE", 50)] = ps.parseStudentPhone;
// studentFieldsUnexpanded[ps.generateKeys("Ses", maxAcademicRecordColumnNum)] = ps.parseAcademicRecordSession;
// studentFieldsUnexpanded[ps.generateKeys("TeacherComments", maxAcademicRecordColumnNum)] =
//   ps.parseAcademicRecordTeacherComments;
// const studentFields = ps.expand(studentFieldsUnexpanded);

// const searchForImages = false;

// export const spreadsheetToStudentList = async (
//   csvString: string,
//   currentStudents: Student[],
// ): Promise<Student[]> => {
//   const students = filter(spreadsheetToList(csvString, studentFields, emptyStudent, 3), (s) => {
//     return s.epId !== 0;
//   });

//   const studentsWithImage = searchForImages
//     ? await setImages(students, "imageName", studentImageFolder)
//     : students;
//   const studentsWithVaccineImage = searchForImages
//     ? await setImages(studentsWithImage, "covidVaccine.imageName", covidVaccineImageFolder)
//     : students;

//   await Promise.all(
//     map(studentsWithVaccineImage, async (student) => {
//       const currentStudent = find(currentStudents, { epId: student.epId });
//       if (
//         !isEqual(
//           searchForImages ? currentStudent : omit(currentStudent, ["imageName", "covidVaccine.imageName"]),
//           student,
//         )
//       ) {
//         await setData(student, "students", "epId", { merge: true });
//       }
//     }),
//   );
//   return sortBy(students, "name.english");
// };

// const waitlistFieldsUnexpanded: ValidFields<WaitingListEntry> = {
//   CORRESPONDENCEDONOTDELETE: ps.parseCorrespondence,
//   EntryDate: wlps.parseWLEntryDate,
//   HIGHPRIORITY: wlps.parseWLHighPriority,
//   "NA,NS,WDUNC,N": wlps.parseWLOutcome,
//   NameOptional: wlps.parseWLName,
//   PE: wlps.parseWLPlacementExam,
//   PhoneYN: wlps.parseWLEnteredInPhone,
//   "Prim,Sec,Other": wlps.parseWLPhone,
//   ProbL3: wlps.parseWLProbL3Plus,
//   ProbPL1: wlps.parseWLProbPL1,
//   ReferralOptional: wlps.parseWLReferral,
//   TransferralToDate: wlps.parseWLTransferralAndDate,
//   VCCode: wlps.parseWLCovidVaccineStatus,
//   VCinWA: wlps.parseWLCovidVaccineNotes,
//   Waiting: wlps.parseWLWaiting,
// };
// const waitlistFields = ps.expand(waitlistFieldsUnexpanded);

// export const waitingListToList = async (csvString: string) => {
//   const newWaitingList = spreadsheetToList(csvString, waitlistFields, emptyWaitingListEntry, 1);
//   forEach(newWaitingList, (nwlEntry) => {
//     forEach(nwlEntry.correspondence, (c) => {
//       if (c.date === null) c.date = nwlEntry.entryDate;
//     });
//     nwlEntry.primaryPhone = first(nwlEntry.phoneNumbers)?.number || -1;
//     nwlEntry.id = v4();
//   });

//   await deleteCollection("waitingList");
//   await Promise.all(
//     map(newWaitingList, async (nwlEntry) => {
//       await setData(nwlEntry, "waitingList", "id", { merge: true });
//     }),
//   );
//   return sortWaitingList(newWaitingList);
// };

const tunisiaStudentFieldsUnexpanded = {
  CERTIFICATEISSUEDDATE: ps.parseCertificateDate,
  CIN: ps.parseCIN,
  COURSEREGISTERED: ps.parseCourseRegistered,
  EMAIL: ps.parseEmail,
  FIRSTNAME: ps.parseName,
  LASTNAME: ps.parseName,
  NOTES: ps.parseNotes,
  NTEL: ps.parsePrimPhone,
  PROFESSION: ps.parseProfession,
  "PaymentAmount,Payment1,Payment2,Payment3": ps.parsePayment,
  "PaymentDate,PaymentDate1,PaymentDate2,PaymentDate3": ps.parsePaymentDate,
  SEMESTER: ps.parseSemester,
  VILLE: ps.parseVille,
};
const tunisiaStudentFields = ps.expand(tunisiaStudentFieldsUnexpanded);

export const tunisiaSpreadsheetToStudentList = async (csvString: string): Promise<Student[]> => {
  const studentPlacements = filter(spreadsheetToList(csvString, tunisiaStudentFields, emptyStudent, 2), (s) => {
    return s.placement.length > 0;
  });
  const students: Student[] = [];
  forEach(studentPlacements, (studentPlacement) => {
    const studentIndex = findIndex(students, (student) => {
      const spSplitName = student.name.english.split(" ");
      const studentPlacementSplitName = studentPlacement.name.english.split(" ");
      return (
        student.name.english === studentPlacement.name.english ||
        (first(spSplitName) === first(studentPlacementSplitName) &&
          includes(map(student.phone?.phoneNumbers, "number"), studentPlacement.phone?.primaryPhone))
      );
    });
    if (studentIndex === -1) {
      studentPlacement.epId = generateId(students);
      students.push(studentPlacement);
    } else {
      if (studentPlacement.name.english.length > students[studentIndex].name.english.length) {
        students[studentIndex].name.english = studentPlacement.name.english;
      }
      if (
        studentPlacement.phone?.primaryPhone &&
        studentPlacement.phone.primaryPhone !== students[studentIndex].phone?.primaryPhone
      ) {
        students[studentIndex].phone = {
          phoneNumbers:
            (students[studentIndex].phone === undefined
              ? [{ number: Number(studentPlacement.phone.primaryPhone) }]
              : includes(
                  map(students[studentIndex].phone?.phoneNumbers, "number"),
                  studentPlacement.phone.primaryPhone,
                )
              ? students[studentIndex].phone?.phoneNumbers
              : [
                  ...(students[studentIndex].phone?.phoneNumbers ?? []),
                  { number: Number(studentPlacement.phone.primaryPhone) },
                ]) ?? [],
          primaryPhone: studentPlacement.phone.primaryPhone,
        };
      }
      if (studentPlacement.nationalID) {
        students[studentIndex].nationalID = studentPlacement.nationalID;
      }
      if (studentPlacement.email) {
        students[studentIndex].email = studentPlacement.email;
      }
      if (studentPlacement.work?.occupation) {
        students[studentIndex].work = { occupation: studentPlacement.work.occupation };
      }
      if (studentPlacement.city) {
        students[studentIndex].city = studentPlacement.city;
      }
      if (studentPlacement.certificateRequests) {
        if (students[studentIndex].certificateRequests) {
          students[studentIndex].certificateRequests += `; ${studentPlacement.certificateRequests}`;
        } else {
          students[studentIndex].certificateRequests = studentPlacement.certificateRequests;
        }
      }
      const firstSessionPlacement = first(studentPlacement.placement);
      if (includes(map(students[studentIndex].placement, "session"), firstSessionPlacement?.session)) {
        const sessionIndex = findIndex(students[studentIndex].placement, (placement) => {
          return placement.session === firstSessionPlacement?.session;
        });
        const firstPlacement = first(firstSessionPlacement?.placement);
        if (firstPlacement) {
          const levelIndex = findIndex(students[studentIndex].placement[sessionIndex].placement, (p) => {
            return toLower(p.level) === toLower(firstPlacement?.level);
          });
          if (levelIndex === -1) {
            students[studentIndex].placement[sessionIndex].placement.push(firstPlacement);
          } else {
            const payment = first(firstPlacement?.payments);
            if (
              payment?.date === undefined ||
              !includes(
                map(students[studentIndex].placement[sessionIndex].placement[levelIndex].payments, "date"),
                payment?.date,
              )
            )
              payment &&
                students[studentIndex].placement[sessionIndex].placement[levelIndex].payments?.push(payment);
          }
        }
      } else {
        firstSessionPlacement && students[studentIndex].placement.push(firstSessionPlacement);
      }
    }
  });

  forEach(students, (student) => {
    const sortedPlacements = sortBy(student.placement, (placement) => {
      return sortBySession(placement.session);
    });
    const initialSession = first(sortedPlacements)?.session;
    forEach(sortedPlacements, (sp) => {
      forEach(sp.placement, (p) => {
        forEach(p.payments, (payment) => {
          if (payment.date) {
            const sessionYear = first(sp.session?.match(/\d{2,4}/));
            if (!includes(payment.date, sessionYear)) {
              const splitDate = payment.date.split("/");
              payment.date = `${nth(splitDate, 0)}/${nth(splitDate, 1)}/${sessionYear}`;
            }
          }
        });
      });
    });
    student.placement = sortedPlacements;
    if (initialSession) student.initialSession = initialSession;
    const currentPlacements = filter(sortedPlacements, (sp) => {
      return sp.session === "Winter 2024";
    });
    if (currentPlacements.length === 0) {
      if (student.status) {
        student.status.currentStatus = Status.WD;
      } else {
        student.status = { currentStatus: Status.WD };
      }
    } else if (student.status) {
      student.status.currentStatus = Status.RET;
    } else {
      student.status = { currentStatus: Status.RET };
    }
  });

  await deleteCollection("students");
  await Promise.all(
    map(students, async (student) => {
      await setData(student, "students", "epId", { merge: true });
    }),
  );

  return sortStudents(students);
};
