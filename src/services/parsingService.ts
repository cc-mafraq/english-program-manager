import {
  first,
  forEach,
  includes,
  isEmpty,
  join,
  last,
  map,
  pullAll,
  range,
  replace,
  split,
  startsWith,
  trim,
  zip,
} from "lodash";
import moment from "moment";
import { MOMENT_FORMAT } from ".";
import {
  DroppedOutReason,
  FinalResult,
  GenderedLevel,
  Grade,
  Level,
  Nationality,
  PhoneNumber,
  Status,
  Student,
} from "../interfaces";
import { ValidFields } from "./spreadsheetService";

const separatorRegex = /[;,]/g;
const phoneRegex = /([\d]+)/;

const splitAndTrim = (value: string, separator?: string | RegExp): string[] => {
  const sep = separator || separatorRegex;
  const splitValues = split(value, sep);
  const trimmedSplitValues = map(splitValues, (v) => {
    return trim(v);
  });
  return trimmedSplitValues;
};

const parseDate = (value?: string) => {
  if (!value) return undefined;
  const date = moment(last(splitAndTrim(value)), ["L", "l", "M/D/YY", "MM/DD/YY", "M-D-YY"]);
  return date.isValid() ? date.format(MOMENT_FORMAT) : undefined;
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

export const generateKeys = (
  keyName: string,
  endNum: number,
  noIncludeKeyName?: boolean,
): string => {
  const nums = range(0, endNum);
  const keyArr: string[] = [];
  !noIncludeKeyName && keyArr.push(keyName);
  forEach(nums, (num) => {
    keyArr.push(keyName + num.toString());
  });
  return join(keyArr, ",");
};

export const parseEnglishName = (key: string, value: string, student: Student) => {
  student.name.english = value;
};

export const parseArabicName = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.name.arabic = value;
};

export const parseID = (key: string, value: string, student: Student) => {
  const id = Number(value);
  if (Number.isNaN(id)) return;
  student.epId = id;
};

export const parseWaPrimPhone = (key: string, value: string, student: Student) => {
  const strippedValue = replace(value, /[" "]/g, "");
  const matchValue = first(phoneRegex.exec(strippedValue));
  const primaryNumber = Number(matchValue);
  if (Number.isNaN(primaryNumber)) return;
  student.phone.primaryPhone = primaryNumber;
};

export const parseNationality = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.nationality =
    Nationality[replace(replace(key, "-", ""), /\s/g, "") as keyof typeof Nationality];
};

export const parseInviteTag = (key: string, value: string, student: Student) => {
  student.status.inviteTag = !!value;
};

export const parseNCL = (key: string, value: string, student: Student) => {
  student.status.noContactList = !!value;
};

export const parseCurrentLevel = (key: string, value: string, student: Student) => {
  student.currentLevel = value as GenderedLevel;
};

export const parseAudit = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.status.audit = true;
};

export const parseFgrDate = (key: string, value: string, student: Student) => {
  const date = parseDate(value);
  if (!date) return;
  student.status.finalGradeSentDate = date;
};

export const parseLevelReevalDate = (key: string, value: string, student: Student) => {
  const date = parseDate(value);
  if (!date) return;
  student.status.levelReevalDate = last(splitAndTrim(date));
};

export const parseSectionsOffered = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.placement.sectionsOffered = value;
};

export const parseReactivatedDate = (key: string, value: string, student: Student) => {
  const date = parseDate(value);
  if (!date) return;
  student.status.reactivatedDate = date;
};

export const parseWithdrawDate = (key: string, value: string, student: Student) => {
  const date = parseDate(value);
  if (!date) return;
  student.status.withdrawDate = date;
};

export const parseCurrentStatus = (key: string, value: string, student: Student) => {
  student.status.currentStatus = Status[value as keyof typeof Status];
};

export const parsePhotoContact = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.placement.photoContact = value;
};

export const parsePlacement = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.placement.placement = value;
};

export const parsePlacementConfDate = (key: string, value: string, student: Student) => {
  const date = parseDate(value);
  if (!date) return;
  student.placement.confDate = date;
};

export const parsePendingPlacement = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.placement.pending = true;
};

export const parseNoAnswerClassSchedule = (key: string, value: string, student: Student) => {
  const date = parseDate(value);
  if (!date) return;
  student.placement.noAnswerClassScheduleDate = date;
};

export const parseCorrespondence = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  const dateRegex = /\d{1,2}(\/|-)\d{1,2}\1\d{2,4}:/g;
  const splitCorrespondence = pullAll(splitAndTrim(value, dateRegex), ["", "/", "-"]);
  const dates = value.match(dateRegex);

  // Handle if the value doesn't start with a date
  if (!startsWith(trim(value), first(dates))) {
    const lastCorrespondence = last(student.correspondence);
    if (lastCorrespondence) {
      lastCorrespondence.notes += ` ${splitCorrespondence[0]}`;
      student.correspondence.pop();
      student.correspondence.push(lastCorrespondence);
    } else {
      student.correspondence.push({
        date: null,
        notes: splitCorrespondence[0],
      });
    }
    splitCorrespondence.shift();
  }
  forEach(
    zip(
      map(dates, (date) => {
        return replace(date, /[:]/g, "");
      }),
      splitCorrespondence,
    ),
    ([date, notes]) => {
      let newDate = date;
      let newNotes = notes;
      const firstTwoChars = Number(notes?.slice(0, 2));
      // Handle if the date was formatted with 4 numbers for the year
      if (!Number.isNaN(firstTwoChars)) {
        newDate = `${date}${firstTwoChars}`;
        newNotes = notes?.slice(2);
      }
      const formattedDate = parseDate(newDate);
      if (newNotes !== undefined && formattedDate !== undefined) {
        student.correspondence.push({
          date: formattedDate,
          notes: newNotes,
        });
      }
    },
  );
};

export const parseClassListSent = (key: string, value: string, student: Student) => {
  student.classList.classListSent =
    value !== "N/A" && value !== "NA" && value !== "No WA" && value !== "";
  if (isEmpty(value)) return;
  student.classList.classListSentNotes = value;
};

export const parseClassListSentDate = (key: string, value: string, student: Student) => {
  const date = parseDate(value);
  if (!date) return;
  student.classList.classListSentDate = date;
};

export const parseGender = (key: string, value: string, student: Student) => {
  Number(value) === 1 ? (student.gender = "M") : (student.gender = "F");
};

export const parseAge = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.age = Number(value);
};

export const parseOccupation = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.work.occupation = value;
};

export const parseLookingForJob = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.work.lookingForJob = value;
};

export const parseTeacher = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.work.isTeacher = true;
};

export const parseTeachingSubjectAreas = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.work.teachingSubjectAreas = value;
};

export const parseEnglishTeacher = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.work.isEnglishTeacher = true;
};

export const parseEnglishTeacherLocation = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.work.englishTeacherLocation = value;
};

export const parsePhone = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  const strippedValue = replace(value, /[" "]/g, "");
  const insideParenRegex = /\(([^)]+)\)/;
  const phoneNumber = strippedValue.match(phoneRegex);
  const phoneNumberNotesMatches = value.match(insideParenRegex);
  const phoneNumberNotes = phoneNumberNotesMatches !== null && phoneNumberNotesMatches[1];
  const numberObject: PhoneNumber = {
    number: Number(phoneNumber),
  };
  if (phoneNumberNotes) {
    numberObject.notes = String(phoneNumberNotes);
  }
  phoneNumber && student.phone.phoneNumbers.push(numberObject);
};

export const parseWABroadcastSAR = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.phone.waBroadcastSAR = value;
};

export const parseWABroadcasts = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1 && !includes(value, "Y")) return;
  student.phone.otherWaBroadcastGroups
    ? student.phone.otherWaBroadcastGroups.push(key)
    : (student.phone.otherWaBroadcastGroups = [key]);
};

export const parseInitialSession = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.initialSession = key;
};

export const parseArabicLiteracy = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.literacy.illiterateAr = true;
};

export const parseEnglishLiteracy = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  student.literacy.illiterateEng = true;
};

export const parseLiteracyTutor = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.literacy.tutorAndDate = value;
};

export const parseZoomTutor = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.zoom = value;
};

export const parseCertRequests = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.certificateRequests = value;
};

export const parseOrigPlacementWriting = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.placement.origPlacementData.writing = value as Level;
};

export const parseOrigPlacementSpeaking = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.placement.origPlacementData.speaking = value as Level;
};

export const parseOrigPlacementLevel = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.placement.origPlacementData.level = value as Level;
};

export const parseOrigPlacementAdjustment = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  student.placement.origPlacementData.adjustment = value;
};

export const parseDropoutReason = (key: string, value: string, student: Student) => {
  if (Number(value) !== 1) return;
  switch (key) {
    case "Lack of Child-Care":
      student.status.droppedOutReason = DroppedOutReason.LCC;
      break;
    case "Lack of Transport":
      student.status.droppedOutReason = DroppedOutReason.LT;
      break;
    case "Time Conflict":
      student.status.droppedOutReason = DroppedOutReason.TC;
      break;
    case "Illness or Pregnancy":
      student.status.droppedOutReason = DroppedOutReason.IP;
      break;
    case "Vision Problems":
      student.status.droppedOutReason = DroppedOutReason.VP;
      break;
    case "Got a Job":
      student.status.droppedOutReason = DroppedOutReason.JOB;
      break;
    case "Moved":
      student.status.droppedOutReason = DroppedOutReason.MOVE;
      break;
    case "Graduated from L5":
      student.status.droppedOutReason = DroppedOutReason.GRAD;
      break;
    case "Failed to Thrive in Clsrm Env":
      student.status.droppedOutReason = DroppedOutReason.FTCLE;
      break;
    case "Lack of Life Mgm Skills":
      student.status.droppedOutReason = DroppedOutReason.LLMS;
      break;
    case "Lack of Familial Support":
      student.status.droppedOutReason = DroppedOutReason.LFS;
      break;
    case "Lack of Commitment or Motivation":
      student.status.droppedOutReason = DroppedOutReason.LCM;
      break;
    case "Family Member or Employer Forbid Further Study":
      student.status.droppedOutReason = DroppedOutReason.FMEF;
      break;
    case "COVID-19 Pandemic Related":
      student.status.droppedOutReason = DroppedOutReason.COVID;
      break;
    case "Unknown":
      student.status.droppedOutReason = DroppedOutReason.UNK;
      break;
    default:
      break;
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
    if (!Number.isNaN(Number(percentGrade))) {
      lastAcademicRecord.finalResult.percentage = Number(percentGrade);
    }
    if (!isEmpty(gradeNotes)) {
      lastAcademicRecord.finalResult.notes = gradeNotes;
    }
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
    const writingExamObject: Grade = {
      result: FinalResult[examGrade[0] as keyof typeof FinalResult],
    };
    if (!isEmpty(gradeNotes)) {
      writingExamObject.notes = gradeNotes;
    }
    if (!Number.isNaN(Number(percentGrade))) {
      writingExamObject.percentage = Number(percentGrade);
    }
    lastAcademicRecord.exitWritingExam = writingExamObject;
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
    const speakingExamObject: Grade = {
      result: FinalResult[examGrade[0] as keyof typeof FinalResult],
    };
    if (!isEmpty(gradeNotes)) {
      speakingExamObject.notes = gradeNotes;
    }
    if (!Number.isNaN(Number(percentGrade))) {
      speakingExamObject.percentage = Number(percentGrade);
    }
    lastAcademicRecord.exitSpeakingExam = speakingExamObject;
  }
};

export const parseAcademicRecordAudit = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  const lastAcademicRecord = last(student.academicRecords);
  if (!lastAcademicRecord) return;
  lastAcademicRecord.levelAudited = value as GenderedLevel;
};

export const parseAcademicRecordAttendance = (key: string, value: string, student: Student) => {
  if (isEmpty(value)) return;
  const percentAttendance = value.match(percentRegex)?.toString();
  const lastAcademicRecord = last(student.academicRecords);
  if (lastAcademicRecord && !Number.isNaN(Number(percentAttendance))) {
    lastAcademicRecord.attendance = Number(percentAttendance);
  }
};

export const parseAcademicRecordTeacherComments = (
  key: string,
  value: string,
  student: Student,
) => {
  if (isEmpty(value)) return;
  const lastAcademicRecord = last(student.academicRecords);
  if (!lastAcademicRecord) return;
  lastAcademicRecord.comments = value;
};
