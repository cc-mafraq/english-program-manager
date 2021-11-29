import {
  forEach,
  includes,
  isEmpty,
  last,
  map,
  pullAll,
  replace,
  split,
  toLower,
  trim,
  zip,
} from "lodash";
import {
  DroppedOutReason,
  FinalResult,
  GenderedLevel,
  Level,
  Nationality,
  Status,
  Student,
} from "../interfaces";
import { ValidFields } from "./spreadsheetService";

const separatorRegex = /[;,]/g;
const dateRegex = /\d{1,2}([/])\d{1,2}\1\d{2}/g;
const phoneRegex = /\d{9,10}/g;

const splitAndTrim = (value: string, separator?: string | RegExp): string[] => {
  const sep = separator || separatorRegex;
  const splitValues = split(value, sep);
  const trimmedSplitValues = map(splitValues, (v) => {
    return trim(v);
  });
  return trimmedSplitValues;
};

// https://stackoverflow.com/questions/14743536/multiple-key-names-same-pair-value
export const expand = (obj: ValidFields) => {
  const keys = Object.keys(obj);
  forEach(keys, (key) => {
    const subkeys = key.split(/,\s?/);
    const target = obj[key];
    delete obj[key];
    subkeys.forEach((subkey) => {
      obj[subkey] = target;
    });
  });
  return obj;
};

export const parseEnglishName = (key: string, value: string, student: Student) => {
  student.name.english = value;
};

export const parseArabicName = (key: string, value: string, student: Student) => {
  student.name.arabic = value;
};

export const parseID = (key: string, value: string, student: Student) => {
  student.epId = Number(value);
};

export const parseWaPrimPhone = (key: string, value: string, student: Student) => {
  const strippedValue = replace(value, /[" "]/g, "");
  student.phone.primaryPhone = Number(phoneRegex.exec(strippedValue));
};

export const parseNationality = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.nationality = Nationality[key as keyof typeof Nationality];
  }
};

export const parseInviteTag = (key: string, value: string, student: Student) => {
  student.status.inviteTag = !!value;
};

export const parseNCL = (key: string, value: string, student: Student) => {
  student.status.noCallList = !!value;
};

export const parseCurrentLevel = (key: string, value: string, student: Student) => {
  student.currentLevel = value as GenderedLevel;
};

export const parseAudit = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.status.audit = true;
  }
};

export const parseFgrDate = (key: string, value: string, student: Student) => {
  student.status.finalGradeSentDate = value;
};

export const parseLevelRevealDate = (key: string, value: string, student: Student) => {
  student.status.levelRevealDate = value;
};

export const parseSectionsOffered = (key: string, value: string, student: Student) => {
  student.status.sectionsOffered = splitAndTrim(value);
};

export const parseReactivatedDate = (key: string, value: string, student: Student) => {
  student.status.reactivatedDate = splitAndTrim(value);
};

export const parseWithdrawDate = (key: string, value: string, student: Student) => {
  student.status.withdrawDate = splitAndTrim(value);
};

export const parseCurrentStatus = (key: string, value: string, student: Student) => {
  student.status.currentStatus = Status[value as keyof typeof Status];
};

export const parsePhotoContact = (key: string, value: string, student: Student) => {
  student.placement.photoContact = splitAndTrim(value);
};

export const parsePlacement = (key: string, value: string, student: Student) => {
  student.placement.placement = splitAndTrim(value);
};

export const parseNotified = (key: string, value: string, student: Student) => {
  student.placement.notified = !!value;
};

export const parsePlacementConfDate = (key: string, value: string, student: Student) => {
  student.placement.confDate = splitAndTrim(value);
};

export const parsePendingPlacement = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.placement.pending = true;
  }
};

export const parseNoAnswerClassSchedule = (key: string, value: string, student: Student) => {
  student.placement.noAnswerClassScheduleDate = value;
};

export const parseCorrespondence = (key: string, value: string, student: Student) => {
  const splitCorrespondence = pullAll(splitAndTrim(replace(value, /[:]/g, ""), dateRegex), [
    "",
    "/",
  ]);
  const dates = value.match(dateRegex);
  forEach(zip(dates, splitCorrespondence), ([date, notes]) => {
    if (date !== undefined && notes !== undefined) {
      student.correspondence.push({
        date,
        notes,
      });
    }
  });
};

export const parseClassListSent = (key: string, value: string, student: Student) => {
  student.classList.classListSent =
    value !== "N/A" && value !== "NA" && value !== "No WA" && value !== "";
  student.classList.classListSentNotes = value;
};

export const parseClassListSentDate = (key: string, value: string, student: Student) => {
  student.classList.classListSentDate = value;
};

export const parseGender = (key: string, value: string, student: Student) => {
  Number(value) === 1 ? (student.gender = "M") : (student.gender = "F");
};

export const parseAge = (key: string, value: string, student: Student) => {
  student.age = value !== "" ? Number(value) : undefined;
};

export const parseOccupation = (key: string, value: string, student: Student) => {
  student.work.occupation = value;
};

export const parseLookingForJob = (key: string, value: string, student: Student) => {
  student.work.lookingForJob = value;
};

export const parseTeacher = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.work.isTeacher = true;
  }
};

export const parseTeachingSubjectAreas = (key: string, value: string, student: Student) => {
  student.work.teachingSubjectAreas = value;
};

export const parseEnglishTeacher = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.work.isEnglishTeacher = true;
  }
};

export const parseEnglishTeacherLocation = (key: string, value: string, student: Student) => {
  student.work.englishTeacherLocation = value;
};

export const parseWAStatus = (key: string, value: string, student: Student) => {
  if (!isEmpty(value)) {
    const lowerValue = toLower(value);
    student.phone.hasWhatsapp =
      includes(lowerValue, "has whatsapp") || includes(lowerValue, "has WA");
    student.phone.whatsappNotes = value;
  }
};

export const parsePhone = (key: string, value: string, student: Student) => {
  if (!isEmpty(value)) {
    const strippedValue = replace(value, /[" "]/g, "");
    const insideParenRegex = /\(([^)]+)\)/;
    const phoneNumber = strippedValue.match(phoneRegex);
    const phoneNumberNotesMatches = value.match(insideParenRegex);
    const phoneNumberNotes = phoneNumberNotesMatches !== null && phoneNumberNotesMatches[1];
    const phoneNumberNotesStr = phoneNumberNotes ? String(phoneNumberNotes) : undefined;
    phoneNumber &&
      student.phone.phoneNumbers.push({
        notes: phoneNumberNotesStr,
        number: Number(phoneNumber),
      });
    value === "has whatsapp" && parseWAStatus(key, value, student);
  }
};

export const parseWABroadcastSAR = (key: string, value: string, student: Student) => {
  student.phone.waBroadcastSAR = value;
};

export const parseWABroadcasts = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.phone.otherWaBroadcastGroups
      ? student.phone.otherWaBroadcastGroups.push(key)
      : (student.phone.otherWaBroadcastGroups = [key]);
  }
};

export const parseInitialSession = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.initialSession = key;
  }
};

export const parseArabicLiteracy = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.literacy.illiterateAr = true;
  }
};

export const parseEnglishLiteracy = (key: string, value: string, student: Student) => {
  if (Number(value) === 1) {
    student.literacy.illiterateEng = true;
  }
};

export const parseLiteracyTutor = (key: string, value: string, student: Student) => {
  student.literacy.tutorAndDate = value;
};

export const parseZoomTutor = (key: string, value: string, student: Student) => {
  student.zoom = value;
};

export const parseCertRequests = (key: string, value: string, student: Student) => {
  student.certificateRequests = value;
};

export const parseOrigPlacementWriting = (key: string, value: string, student: Student) => {
  student.placement.origPlacementData.writing = value as Level;
};

export const parseOrigPlacementSpeaking = (key: string, value: string, student: Student) => {
  student.placement.origPlacementData.speaking = value as Level;
};

export const parseOrigPlacementLevel = (key: string, value: string, student: Student) => {
  student.placement.origPlacementData.level = value as Level;
};

export const parseOrigPlacementAdjustment = (key: string, value: string, student: Student) => {
  student.placement.origPlacementData.adjustment = value;
};

export const parseDropoutReason = (key: string, value: string, student: Student) => {
  // student.droppedOutReason = DroppedOutReason[key as keyof typeof DroppedOutReason];
  if (Number(value) === 1) {
    switch (key) {
      case "Lack of Child-Care":
        student.droppedOutReason = DroppedOutReason.LCC;
        break;
      case "Lack of Transport":
        student.droppedOutReason = DroppedOutReason.LT;
        break;
      case "Time Conflict":
        student.droppedOutReason = DroppedOutReason.TC;
        break;
      case "Illness or Pregnancy":
        student.droppedOutReason = DroppedOutReason.IP;
        break;
      case "Vision Problems":
        student.droppedOutReason = DroppedOutReason.VP;
        break;
      case "Got a Job":
        student.droppedOutReason = DroppedOutReason.JOB;
        break;
      case "Moved":
        student.droppedOutReason = DroppedOutReason.MOVE;
        break;
      case "Graduated from L5":
        student.droppedOutReason = DroppedOutReason.GRAD;
        break;
      case "Failed to Thrive in Clsrm Env":
        student.droppedOutReason = DroppedOutReason.FTCLE;
        break;
      case "Lack of Life Mgm Skills":
        student.droppedOutReason = DroppedOutReason.LLMS;
        break;
      case "Lack of Familial Support":
        student.droppedOutReason = DroppedOutReason.LFS;
        break;
      case "Lack of Commitment or Motivation":
        student.droppedOutReason = DroppedOutReason.LCM;
        break;
      case "Family Member or Employer Forbid Further Study":
        student.droppedOutReason = DroppedOutReason.FMEF;
        break;
      case "COVID-19 Pandemic Related":
        student.droppedOutReason = DroppedOutReason.COVID;
        break;
      case "Unknown":
        student.droppedOutReason = DroppedOutReason.UNK;
        break;
      default:
        break;
    }
  }
};

export const parseAcademicRecordSession = (key: string, value: string, student: Student) => {
  value && student.academicRecords.push({ session: value });
};

export const parseAcademicRecordLevel = (key: string, value: string, student: Student) => {
  const lastAcademicRecord = last(student.academicRecords);
  if (lastAcademicRecord && value) {
    lastAcademicRecord.level = value as GenderedLevel;
  }
};

export const parseAcademicRecordResult = (key: string, value: string, student: Student) => {
  const resultRegex = /P|F|WD/;
  const keyGrade = key.match(resultRegex);
  const lastAcademicRecord = last(student.academicRecords);
  if (lastAcademicRecord && Number(value) === 1 && keyGrade) {
    lastAcademicRecord.finalResult = {
      result: FinalResult[keyGrade[0] as keyof typeof FinalResult],
    };
  }
};

const percentRegex = /\d{1,3}/;
const removeFromNotesRegex = /[()%]/g;

export const parseAcademicRecordFinalGrade = (key: string, value: string, student: Student) => {
  const percentGrade = value.match(percentRegex)?.toString();
  const gradeNotes = trim(replace(replace(value, percentRegex, ""), removeFromNotesRegex, ""));
  const lastAcademicRecord = last(student.academicRecords);
  if (lastAcademicRecord && lastAcademicRecord.finalResult) {
    lastAcademicRecord.finalResult.percentage = Number.isNaN(Number(percentGrade))
      ? undefined
      : Number(percentGrade);
    lastAcademicRecord.finalResult.notes = gradeNotes;
  }
};

export const parseAcademicRecordExitWritingExam = (
  key: string,
  value: string,
  student: Student,
) => {
  const resultRegex = /P|F/;
  const examGrade = value.match(resultRegex);
  const percentGrade = value.match(percentRegex)?.toString();
  const gradeNotes = trim(
    replace(replace(replace(value, percentRegex, ""), removeFromNotesRegex, ""), /P|F/, ""),
  );
  const lastAcademicRecord = last(student.academicRecords);
  if (lastAcademicRecord && examGrade) {
    lastAcademicRecord.exitWritingExam = {
      notes: gradeNotes,
      percentage: Number.isNaN(Number(percentGrade)) ? undefined : Number(percentGrade),
      result: FinalResult[examGrade[0] as keyof typeof FinalResult],
    };
  }
};

export const parseAcademicRecordExitSpeakingExam = (
  key: string,
  value: string,
  student: Student,
) => {
  const resultRegex = /P|F/;
  const examGrade = value.match(resultRegex);
  const percentGrade = value.match(percentRegex)?.toString();
  const gradeNotes = trim(
    replace(replace(replace(value, percentRegex, ""), removeFromNotesRegex, ""), /P|F/, ""),
  );
  const lastAcademicRecord = last(student.academicRecords);
  if (lastAcademicRecord && examGrade) {
    lastAcademicRecord.exitSpeakingExam = {
      notes: gradeNotes,
      percentage: Number.isNaN(Number(percentGrade)) ? undefined : Number(percentGrade),
      result: FinalResult[examGrade[0] as keyof typeof FinalResult],
    };
  }
};

export const parseAcademicRecordAudit = (key: string, value: string, student: Student) => {
  if (!isEmpty(value)) {
    const lastAcademicRecord = last(student.academicRecords);
    if (lastAcademicRecord) {
      lastAcademicRecord.levelAudited = value as GenderedLevel;
    }
  }
};

export const parseAcademicRecordAttendance = (key: string, value: string, student: Student) => {
  if (!isEmpty(value)) {
    const percentAttendance = value.match(percentRegex)?.toString();
    const lastAcademicRecord = last(student.academicRecords);
    if (lastAcademicRecord) {
      lastAcademicRecord.attendance = Number.isNaN(Number(percentAttendance))
        ? undefined
        : Number(percentAttendance);
    }
  }
};

export const parseAcademicRecordTeacherComments = (
  key: string,
  value: string,
  student: Student,
) => {
  if (!isEmpty(value)) {
    const lastAcademicRecord = last(student.academicRecords);
    if (lastAcademicRecord) {
      lastAcademicRecord.comments = value;
    }
  }
};

export const parseAcademicRecordCertificate = (key: string, value: string, student: Student) => {
  if (!isEmpty(value)) {
    const lastAcademicRecord = last(student.academicRecords);
    if (lastAcademicRecord) {
      lastAcademicRecord.certificate = includes(value, "Y");
    }
  }
};
