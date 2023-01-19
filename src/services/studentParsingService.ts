// import {
//   filter,
//   first,
//   forEach,
//   get,
//   includes,
//   isEmpty,
//   join,
//   last,
//   lowerCase,
//   map,
//   pullAll,
//   range,
//   replace,
//   set,
//   split,
//   startsWith,
//   trim,
//   zip,
// } from "lodash";
// import moment from "moment";
// import { MOMENT_FORMAT } from ".";
// import {
//   CovidStatus,
//   DroppedOutReason,
//   FinalResult,
//   GenderedLevel,
//   Grade,
//   Level,
//   LevelPlus,
//   Nationality,
//   PhoneNumber,
//   Status,
//   Student,
//   WaitingListEntry,
// } from "../interfaces";
// import { ValidFields } from "./spreadsheetService";

// const separatorRegex = /[;,&]/g;
// const phoneRegex = /([\d]+)/;
export const dateRegex = /\d{1,2}(\/|-)\d{1,2}\1\d{2,4}/g;

// export const splitAndTrim = (value: string, separator?: string | RegExp): string[] => {
//   const sep = separator || separatorRegex;
//   const splitValues = split(value, sep);
//   const trimmedSplitValues = map(splitValues, (v) => {
//     return trim(v);
//   });
//   return trimmedSplitValues;
// };

// const parseDateVal = (value?: string) => {
//   if (!value) return undefined;
//   const valueNoLetters = trim(replace(value, /[a-z]|[A-Z]/, ""));
//   const date = moment(valueNoLetters, ["L", "l", "M/D/YY", "MM/DD/YY", "M-D-YY", "M/D"]);
//   return date.isValid() ? date.format(MOMENT_FORMAT) : undefined;
// };

// // https://stackoverflow.com/questions/14743536/multiple-key-names-same-pair-value
// export const expand = <T>(obj: ValidFields<T>) => {
//   const keys = Object.keys(obj);
//   forEach(keys, (key) => {
//     const subkeys = key.split(/,\s?/);
//     const target = obj[key];
//     delete obj[key];
//     subkeys.forEach((subkey) => {
//       obj[subkey] = target;
//     });
//   });
//   return obj;
// };

// export const parseDateField = <T extends object>(fieldPath: string) => {
//   return (key: string, value: string, object: T) => {
//     const lastMatch = last(value.match(dateRegex));
//     if (!lastMatch) return;
//     const date = parseDateVal(last(splitAndTrim(lastMatch)));
//     if (!date || !value) return;
//     set(object, fieldPath, date);
//   };
// };

// const parseDateFields = (fieldPath: string) => {
//   return (key: string, value: string, student: Student) => {
//     const dates = filter(
//       map(splitAndTrim(value), (val) => {
//         return parseDateVal(val);
//       }),
//       (val) => {
//         return val !== undefined;
//       },
//     );
//     if (dates?.length === 0) return;
//     set(student, fieldPath, dates);
//   };
// };

// export const parseOptionalString = <T extends object>(fieldPath: string) => {
//   return (key: string, value: string, object: T) => {
//     if (isEmpty(value)) return;
//     set(object, fieldPath, value);
//   };
// };

// export const parseOptionalBoolean = <T extends object>(fieldPath: string) => {
//   return (key: string, value: string, object: T) => {
//     if (Number(value) === 1 || value.toLowerCase() === "yes") {
//       set(object, fieldPath, true);
//     } else if (value.toLowerCase() === "no") {
//       set(object, fieldPath, false);
//     }
//   };
// };

// export const generateKeys = (keyName: string, endNum: number, noIncludeKeyName?: boolean): string => {
//   const nums = range(0, endNum);
//   const keyArr: string[] = [];
//   !noIncludeKeyName && keyArr.push(keyName);
//   forEach(nums, (num) => {
//     keyArr.push(keyName + num.toString());
//   });
//   return join(keyArr, ",");
// };

// export const parseEnglishName = (key: string, value: string, student: Student) => {
//   student.name.english = value;
// };

// export const parseArabicName = (key: string, value: string, student: Student) => {
//   if (isEmpty(value)) return;
//   student.name.arabic = value;
// };

// export const parseID = (key: string, value: string, student: Student) => {
//   const id = Number(value);
//   if (Number.isNaN(id)) return;
//   student.epId = id;
// };

// export const parseWaPrimPhone = (key: string, value: string, student: Student) => {
//   const strippedValue = replace(value, /[" "]/g, "");
//   const matchValue = first(phoneRegex.exec(strippedValue));
//   const primaryNumber = Number(matchValue);
//   if (Number.isNaN(primaryNumber)) return;
//   student.phone.primaryPhone = primaryNumber;
// };

// export const parseNationality = (key: string, value: string, student: Student) => {
//   if (Number(value) !== 1) return;
//   student.nationality = Nationality[replace(replace(key, "-", ""), /\s/g, "") as keyof typeof Nationality];
// };

// export const parseInviteTag = (key: string, value: string, student: Student) => {
//   student.status.inviteTag = !!value;
// };

// export const parseNCL = (key: string, value: string, student: Student) => {
//   student.status.noContactList = !!value;
// };

// export const parseCurrentLevel = (key: string, value: string, student: Student) => {
//   student.currentLevel = trim(value) as GenderedLevel;
// };

// export const parseAudit = parseOptionalString("status.audit");
// export const parsePendingPlacement = parseOptionalBoolean("placement.pending");

// export const parseFgrDate = parseDateField("status.finalGradeSentDate");
// export const parseLevelReevalDate = parseDateField("status.levelReevalDate");
// export const parseReactivatedDate = parseDateFields("status.reactivatedDate");
// export const parseWithdrawDate = parseDateFields("status.withdrawDate");
// export const parseNoAnswerClassSchedule = parseOptionalBoolean("placement.noAnswerClassScheduleWpm");

// export const parseSectionsOffered = parseOptionalString("placement.sectionsOffered");
// export const parsePhotoContact = parseOptionalString("placement.photoContact");
// export const parsePlacement = parseOptionalString("placement.placement");

// export const parseCurrentStatus = (key: string, value: string, student: Student) => {
//   student.status.currentStatus = Status[value as keyof typeof Status];
//   if (trim(value) === "NCL") {
//     student.status.currentStatus = Status.WD;
//     student.status.noContactList = true;
//   }
// };

// export const parseCorrespondence = (key: string, value: string, student: Student | WaitingListEntry) => {
//   if (isEmpty(value)) return;
//   const dateRegexWithColon = /\d{1,2}(\/|-)\d{1,2}\1\d{2,4}:/g;
//   const splitCorrespondence = pullAll(splitAndTrim(value, dateRegexWithColon), ["", "/", "-"]);
//   const dates = value.match(dateRegexWithColon);

//   // Handle if the value doesn't start with a date
//   if (!startsWith(trim(value), first(dates))) {
//     const lastCorrespondence = last(student.correspondence);
//     if (lastCorrespondence) {
//       lastCorrespondence.notes += ` ${splitCorrespondence[0]}`;
//       student.correspondence.pop();
//       student.correspondence.push(lastCorrespondence);
//     } else {
//       student.correspondence.push({
//         date: null,
//         notes: splitCorrespondence[0],
//       });
//     }
//     splitCorrespondence.shift();
//   }
//   forEach(
//     zip(
//       map(dates, (date) => {
//         return replace(date, /[:]/g, "");
//       }),
//       splitCorrespondence,
//     ),
//     ([date, notes]) => {
//       let newDate = date;
//       let newNotes = notes;
//       const firstTwoChars = Number(notes?.slice(0, 2));
//       // Handle if the date was formatted with 4 numbers for the year
//       if (!Number.isNaN(firstTwoChars)) {
//         newDate = `${date}${firstTwoChars}`;
//         newNotes = notes?.slice(2);
//       }
//       const formattedDate = parseDateVal(newDate);
//       if (newNotes !== undefined && formattedDate !== undefined) {
//         student.correspondence.push({
//           date: formattedDate,
//           notes: newNotes,
//         });
//       }
//     },
//   );
// };

// export const parseClassScheduleSentDate = parseDateFields("placement.classScheduleSentDate");

// export const parseGender = (key: string, value: string, student: Student) => {
//   Number(value) === 1 ? (student.gender = "M") : (student.gender = "F");
// };

// export const parseAge = (key: string, value: string, student: Student) => {
//   const numValue = Number(value);
//   if (isEmpty(value) || Number.isNaN(numValue)) return;
//   student.age = numValue;
// };

// export const parseOccupation = parseOptionalString("work.occupation");
// export const parseLookingForJob = parseOptionalString("work.lookingForJob");
// export const parseTeachingSubjectAreas = parseOptionalString("work.teachingSubjectAreas");
// export const parseEnglishTeacherLocation = parseOptionalString("work.englishTeacherLocation");

// export const parseTeacher = parseOptionalBoolean("work.isTeacher");
// export const parseEnglishTeacher = parseOptionalBoolean("work.isEnglishTeacher");

// export const parsePhone = <T extends object>(fieldPath: string) => {
//   return (key: string, value: string, object: T) => {
//     if (isEmpty(value)) return;
//     const strippedValue = replace(value, /[" "]/g, "");
//     const insideParenRegex = /\(([^)]+)\)/;
//     const phoneNumber = strippedValue.match(phoneRegex);
//     const phoneNumberNotesMatches = value.match(insideParenRegex);
//     const phoneNumberNotes = phoneNumberNotesMatches !== null && phoneNumberNotesMatches[1];
//     const numberObject: PhoneNumber = {
//       number: Number(first(phoneNumber)),
//     };
//     if (phoneNumberNotes) {
//       numberObject.notes = String(phoneNumberNotes);
//     }
//     phoneNumber && get(object, fieldPath).push(numberObject);
//   };
// };

// export const parseStudentPhone = parsePhone("phone.phoneNumbers");

// export const parseWABroadcastSAR = parseOptionalString("phone.waBroadcastSAR");

// export const parseWABroadcasts = (key: string, value: string, student: Student) => {
//   if (Number(value) !== 1 && !includes(value, "Y")) return;
//   student.phone.otherWaBroadcastGroups
//     ? student.phone.otherWaBroadcastGroups.push(key)
//     : (student.phone.otherWaBroadcastGroups = [key]);
// };

// export const parseInitialSession = (key: string, value: string, student: Student) => {
//   if (Number(value) !== 1) return;
//   student.initialSession = key.charAt(0) + lowerCase(key.charAt(1)) + key.slice(2);
// };

// export const parseArabicLiteracy = parseOptionalBoolean("literacy.illiterateAr");
// export const parseEnglishLiteracy = parseOptionalBoolean("literacy.illiterateEng");
// export const parseLiteracyTutor = parseOptionalString("literacy.tutorAndDate");
// export const parseZoomTutor = parseOptionalString("zoom");

// export const parseCertRequests = parseOptionalString("certificateRequests");

// export const parseOrigPlacementWriting = (key: string, value: string, student: Student) => {
//   student.origPlacementData.writing = value as LevelPlus;
// };

// export const parseOrigPlacementSpeaking = (key: string, value: string, student: Student) => {
//   student.origPlacementData.speaking = value as LevelPlus;
// };

// export const parseOrigPlacementLevel = (key: string, value: string, student: Student) => {
//   student.origPlacementData.level = value as Level;
// };

// export const parseOrigPlacementAdjustment = parseOptionalString("origPlacementData.adjustment");

// export const parseDropoutReason = (key: string, value: string, student: Student) => {
//   if (Number(value) !== 1) return;
//   switch (key) {
//     case "Lack of Child-Care":
//       student.status.droppedOutReason = DroppedOutReason.LCC;
//       break;
//     case "Lack of Transport":
//       student.status.droppedOutReason = DroppedOutReason.LT;
//       break;
//     case "Time Conflict":
//       student.status.droppedOutReason = DroppedOutReason.TC;
//       break;
//     case "Illness or Pregnancy":
//       student.status.droppedOutReason = DroppedOutReason.IP;
//       break;
//     case "Vision Problems":
//       student.status.droppedOutReason = DroppedOutReason.VP;
//       break;
//     case "Got a Job":
//       student.status.droppedOutReason = DroppedOutReason.JOB;
//       break;
//     case "Moved":
//       student.status.droppedOutReason = DroppedOutReason.MOVE;
//       break;
//     case "Graduated from L5":
//       student.status.droppedOutReason = DroppedOutReason.GRAD;
//       break;
//     case "Failed to Thrive in Clsrm Env":
//       student.status.droppedOutReason = DroppedOutReason.FTCLE;
//       break;
//     case "Lack of Life Mgm Skills":
//       student.status.droppedOutReason = DroppedOutReason.LLMS;
//       break;
//     case "Lack of Familial Support":
//       student.status.droppedOutReason = DroppedOutReason.LFS;
//       break;
//     case "Lack of Commitment or Motivation":
//       student.status.droppedOutReason = DroppedOutReason.LCM;
//       break;
//     case "Family Member or Employer Forbid Further Study":
//       student.status.droppedOutReason = DroppedOutReason.FMEF;
//       break;
//     case "COVID-19 Pandemic Related":
//       student.status.droppedOutReason = DroppedOutReason.COVID;
//       break;
//     case "Unknown":
//       student.status.droppedOutReason = DroppedOutReason.UNK;
//       break;
//     default:
//       break;
//   }
// };

// export const parseAcademicRecordSession = (key: string, value: string, student: Student) => {
//   value && student.academicRecords.push({ session: value });
// };

// export const parseAcademicRecordLevel = (key: string, value: string, student: Student) => {
//   const lastAcademicRecord = last(student.academicRecords);
//   if (lastAcademicRecord && value) {
//     lastAcademicRecord.level = value as GenderedLevel;
//   }
// };

// export const parseAcademicRecordResult = (key: string, value: string, student: Student) => {
//   const resultRegex = /P|F|WD/;
//   const keyGrade = key.match(resultRegex);
//   const lastAcademicRecord = last(student.academicRecords);
//   if (lastAcademicRecord && Number(value) === 1 && keyGrade) {
//     lastAcademicRecord.finalGrade = {
//       result: FinalResult[keyGrade[0] as keyof typeof FinalResult],
//     };
//   }
// };

// const numberRegex = /[\d]+/;
// const percentRegex = /[\d]{1,3}%/;
// const removeFromNotesRegex = /[();:]|Wrtg|Spkg|Exit|P\s|F\s|W\s|S\s/g;

// const getPercent = (value: string) => {
//   return (
//     first(value.match(percentRegex)?.toString().match(numberRegex)) || first(value.match(numberRegex))?.toString()
//   );
// };

// const getGradeNotes = (value: string) => {
//   return trim(replace(replace(value, percentRegex, ""), removeFromNotesRegex, ""));
// };

// export const parseAcademicRecordFinalGrade = (key: string, value: string, student: Student) => {
//   const percentGrade = getPercent(value);
//   const gradeNotes = getGradeNotes(value);
//   const lastAcademicRecord = last(student.academicRecords);
//   const percentGradeIsNumber = !Number.isNaN(Number(percentGrade));
//   if (lastAcademicRecord) {
//     if (percentGradeIsNumber) {
//       if (!lastAcademicRecord.finalGrade) {
//         lastAcademicRecord.finalGrade = {};
//       }
//       lastAcademicRecord.finalGrade.percentage = Number(percentGrade);
//     }
//     if (!isEmpty(gradeNotes)) {
//       if (!lastAcademicRecord.finalGrade) {
//         lastAcademicRecord.finalGrade = {};
//       }
//       lastAcademicRecord.finalGrade.notes = gradeNotes;
//     }
//   }
// };

// const parseAcademicRecordExam = (fieldPath: string) => {
//   return (key: string, value: string, student: Student) => {
//     const resultRegex = /P|F/;
//     const examGrade = value.match(resultRegex);
//     const percentGrade = getPercent(value);
//     const gradeNotes = getGradeNotes(replace(value, resultRegex, ""));
//     const lastAcademicRecord = last(student.academicRecords);
//     if (lastAcademicRecord) {
//       const examObject: Grade = {};
//       if (examGrade) {
//         examObject.result = FinalResult[examGrade[0] as keyof typeof FinalResult];
//       }
//       if (!isEmpty(gradeNotes) && Number.isNaN(Number(replace(gradeNotes, /\s/g, "")))) {
//         examObject.notes = gradeNotes;
//       }
//       if (!Number.isNaN(Number(percentGrade))) {
//         examObject.percentage = Number(percentGrade);
//       }
//       if (!isEmpty(examObject)) {
//         set(lastAcademicRecord, fieldPath, examObject);
//       }
//       if (value.match(/Spkg|S\s/) && fieldPath !== "exitSpeakingExam") {
//         parseAcademicRecordExam("exitSpeakingExam")(key, value.slice(value.indexOf("S")), student);
//       }
//     }
//   };
// };

// export const parseAcademicRecordExitWritingExam = parseAcademicRecordExam("exitWritingExam");
// export const parseAcademicRecordExitSpeakingExam = parseAcademicRecordExam("exitSpeakingExam");

// export const parseAcademicRecordAudit = (key: string, value: string, student: Student) => {
//   if (isEmpty(value)) return;
//   const lastAcademicRecord = last(student.academicRecords);
//   if (!lastAcademicRecord) return;
//   lastAcademicRecord.levelAudited = value as GenderedLevel;
// };

// export const parseAcademicRecordAttendance = (key: string, value: string, student: Student) => {
//   if (isEmpty(value)) return;
//   const percentAttendance = getPercent(value);
//   const lastAcademicRecord = last(student.academicRecords);
//   if (lastAcademicRecord && !Number.isNaN(Number(percentAttendance))) {
//     lastAcademicRecord.attendance = Number(percentAttendance);
//   }
// };

// export const parseAcademicRecordTeacherComments = (key: string, value: string, student: Student) => {
//   if (isEmpty(value)) return;
//   const lastAcademicRecord = last(student.academicRecords);
//   if (!lastAcademicRecord) return;
//   lastAcademicRecord.comments = value;
// };

// export const parseCovidStatus = (key: string, value: string, student: Student) => {
//   if (Number(value) !== 1) return;
//   switch (key) {
//     case "JORDANIAN UNVACC'D":
//     case "SYRIAN UNVACC'D":
//     case "OTHER NATIONALITY UNVACC'D":
//       student.covidVaccine.status = CovidStatus.UNV;
//       break;
//     case "JORDANIAN PARTIALLY VACC'D":
//     case "SYRIAN PARTIALLY VACC'D":
//     case "OTHER NATIONALITY PARTIALLY VACC'D":
//       student.covidVaccine.status = CovidStatus.PART;
//       break;
//     case "JORDANIAN FULLY VACC'D":
//     case "SYRIAN FULLY VACC'D":
//     case "OTHER NATIONALITY FULLY VACC'D":
//       student.covidVaccine.status = CovidStatus.FULL;
//       break;
//     case "EXEMPT FROM VACCINE":
//     case "V EXEMPT":
//       student.covidVaccine.status = CovidStatus.EXEMPT;
//       break;
//     case "BOOSTER (THIRD DOSE)":
//       student.covidVaccine.status = CovidStatus.BOOST;
//       break;
//     case "ANSWERED BUT ANSWER UNCLEAR":
//       student.covidVaccine.status = CovidStatus.UNCL;
//       break;
//     case "DECLINED TO PROVIDE VACCINE INFO":
//       student.covidVaccine.status = CovidStatus.DECL;
//       break;
//     default:
//       break;
//   }
// };

// export const parseCovidDate = parseDateField("covidVaccine.date");
// export const parseCovidReason = parseOptionalString("covidVaccine.reason");
// export const parseCovidSuspectedFraud = parseOptionalBoolean("covidVaccine.suspectedFraud");
// export const parseCovidSuspectedFraudReason = parseOptionalString("covidVaccine.suspectedFraudReason");
// export const parseFamilyCoordinator = parseOptionalString("familyCoordinatorEntry");

// export const parseCheatingSessions = (key: string, value: string, student: Student) => {
//   if (!value) return;
//   student.status.cheatingSessions = splitAndTrim(value);
// };
export {};
