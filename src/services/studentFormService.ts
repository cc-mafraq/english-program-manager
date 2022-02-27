import {
  cloneDeep,
  forEach,
  forOwn,
  indexOf,
  isArray,
  isEmpty,
  isNaN,
  isNull,
  isObject,
  isUndefined,
  map,
  mapValues,
  merge,
  omitBy,
  pickBy,
  some,
  split,
  trim,
} from "lodash";
import moment from "moment";
import { array, bool, mixed, number, object, string } from "yup";
import {
  DroppedOutReason,
  FinalResult,
  GenderedLevel,
  genderedLevels,
  Level,
  LevelPlus,
  levels,
  levelsPlus,
  Nationality,
  Status,
  Student,
} from "../interfaces";

const stringToArray = (value: string, originalValue: string) => {
  const separators = /,|;|\t/g;
  return originalValue
    ? isArray(originalValue)
      ? some(originalValue)
        ? originalValue
        : null
      : originalValue.match(separators)
      ? map(split(originalValue, separators), (val) => {
          return trim(val);
        })
      : [originalValue]
    : null;
};

const stringToInteger = (value: string, originalValue: string) => {
  const parsedInt = parseInt(originalValue);
  return isNaN(parsedInt) ? undefined : parsedInt;
};

const stringToStatus = (value: string, originalValue: string) => {
  return Status[originalValue as keyof typeof Status];
};

const stringToNationality = (value: string, originalValue: string) => {
  return Nationality[originalValue as keyof typeof Nationality];
};

const stringToResult = (value: string, originalValue: string) => {
  return originalValue ? FinalResult[originalValue as keyof typeof FinalResult] : null;
};

const dateToString = (value: string, originalValue: string) => {
  return originalValue ? moment(originalValue).format("L") : null;
};

const emptyToNull = (value: string, originalValue: string) => {
  return isEmpty(originalValue) ? null : originalValue;
};

const percentageSchema = number()
  .min(0)
  .max(100)
  .integer()
  .transform(stringToInteger)
  .nullable()
  .optional();

// https://www.regular-expressions.info/dates.html
const dateSchema = string()
  .matches(
    /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/,
    "Invalid date format. The format must be MM-DD-YYYY",
  )
  .transform(dateToString);

const gradeSchema = object()
  .shape({
    notes: string().transform(emptyToNull).nullable().optional(),
    percentage: percentageSchema,
    result: mixed<FinalResult>()
      .oneOf(Object.values(FinalResult) as FinalResult[])
      .transform(stringToResult)
      .nullable()
      .optional(),
  })
  .optional();

const academicRecordsSchema = object().shape({
  attendance: percentageSchema,
  certificate: bool().optional(),
  comments: string().transform(emptyToNull).nullable().optional(),
  electiveClass: string().transform(emptyToNull).nullable().optional(),
  exitSpeakingExam: gradeSchema,
  exitWritingExam: gradeSchema,
  finalResult: gradeSchema,
  level: mixed<GenderedLevel>().oneOf(genderedLevels).transform(emptyToNull).nullable().optional(),
  levelAudited: mixed<GenderedLevel>()
    .oneOf(genderedLevels)
    .transform(emptyToNull)
    .nullable()
    .optional(),
  session: string().required("Session is required"),
});

const classListSchema = object().shape({
  classListSent: bool().optional(),
  classListSentDate: dateSchema.nullable().optional(),
  classListSentNotes: string().transform(emptyToNull).nullable().optional(),
});

const correspondenceSchema = object().shape({
  date: dateSchema.required("Date is required"),
  notes: string().required(
    "Correspondence notes are required if added. You can remove the correspondence by clicking the X button",
  ),
});

const literacySchema = object().shape({
  illiterateAr: bool().optional(),
  illiterateEng: bool().optional(),
  tutorAndDate: string().transform(emptyToNull).nullable().optional(),
});

const nameSchema = object()
  .shape({
    arabic: string()
      .matches(/^[\u0621-\u064A\s]+|(N\/A)/, "Arabic name must be in arabic or N/A")
      .required("Arabic name is required. You may write N/A"),
    english: string().required("English name is required"),
  })
  .required();

const phoneNumberSchema = object()
  .shape({
    notes: string().transform(emptyToNull).nullable().optional(),
    number: number()
      .transform(emptyToNull)
      .transform(stringToInteger)
      .test("valid-phone-number", "The phone number is not valid", (value) => {
        return (
          value !== undefined &&
          ((value > 700000000 && value < 800000000) ||
            (value > 201200000000 && value < 201300000000))
        );
      })
      .required(
        "Phone number is required if added. You can remove the correspondence by clicking the X button",
      ),
  })
  .required();

const phoneSchema = object()
  .shape({
    hasWhatsapp: bool().required(),
    otherWaBroadcastGroups: array().of(string()).transform(stringToArray).nullable().optional(),
    phoneNumbers: array().of(phoneNumberSchema).min(1),
    primaryPhone: number()
      .test("one-primary-phone", "Exactly one primary number must be selected", (value) => {
        return value !== undefined && value >= 0;
      })
      .transform((value, originalValue) => {
        const originalValueBool = map(originalValue, (val) => {
          return val === true || val === "true";
        });
        const trueIndex = indexOf(originalValueBool, true);
        if (trueIndex !== -1) {
          originalValueBool.splice(trueIndex, 1);
          if (indexOf(originalValueBool, true) === -1) {
            return trueIndex;
          }
        }
        return undefined;
      })
      .required(),
    waBroadcastSAR: string().transform(emptyToNull).nullable().optional(),
    whatsappNotes: string().transform(emptyToNull).nullable().optional(),
  })
  .required();

const placementSchema = object().shape({
  confDate: dateSchema.nullable().optional(),
  noAnswerClassScheduleDate: dateSchema.nullable().optional(),
  origPlacementData: object()
    .shape({
      adjustment: string().transform(emptyToNull).nullable().optional(),
      level: mixed<Level>().oneOf(levels).required("Original placement level is required"),
      speaking: mixed<LevelPlus | "Exempt">()
        .oneOf(levelsPlus)
        .required("Original speaking placement is required"),
      writing: mixed<LevelPlus | "Exempt">()
        .oneOf(levelsPlus)
        .required("Original writing placement is required"),
    })
    .required(),
  pending: bool().optional(),
  photoContact: dateSchema.nullable().optional(),
  placement: string().transform(emptyToNull).nullable().optional(),
  sectionsOffered: string().transform(emptyToNull).nullable().optional(),
});

const statusSchema = object().shape({
  audit: bool().optional(),
  currentStatus: mixed<Status>()
    .oneOf(Object.values(Status) as Status[])
    .transform(stringToStatus)
    .required("Current status is required"),
  droppedOutReason: mixed<DroppedOutReason>()
    .oneOf(Object.values(DroppedOutReason) as DroppedOutReason[])
    .transform(emptyToNull)
    .nullable()
    .optional(),
  finalGradeSentDate: dateSchema.nullable().optional(),
  inviteTag: bool().required(),
  levelReevalDate: dateSchema.nullable().optional(),
  noContactList: bool().required(),
  reactivatedDate: dateSchema.nullable().optional(),
  withdrawDate: dateSchema.nullable().optional(),
});

const workSchema = object().shape({
  englishTeacherLocation: string().transform(emptyToNull).nullable().optional(),
  isEnglishTeacher: bool().optional(),
  isTeacher: bool().optional(),
  lookingForJob: string().transform(emptyToNull).nullable().optional(),
  occupation: string().required("Occupation is required"),
  teachingSubjectAreas: string().transform(emptyToNull).nullable().optional(),
});

export const studentFormSchema = object().shape({
  academicRecords: array().of(academicRecordsSchema),
  age: number().transform(stringToInteger).min(13).max(99).integer().nullable().optional(),
  certificateRequests: string().transform(emptyToNull).nullable().optional(),
  classList: classListSchema,
  correspondence: array().of(correspondenceSchema),
  currentLevel: mixed<GenderedLevel>().oneOf(genderedLevels).required("Current level is required"),
  epId: number().min(10000).max(99999).integer().required("ID is required"),
  gender: mixed<"M" | "F">().oneOf(["M", "F"]).required("Gender is required"),
  initialSession: string()
    .matches(/(FA|SP) (I|II) \d{2}/, "Initial session must be FA/SP I/II year (e.g. SP I 22)")
    .typeError("Initial session is required")
    .required("Initial session is required"),
  literacy: literacySchema,
  name: nameSchema,
  nationality: mixed<Nationality>()
    .oneOf(Object.values(Nationality) as Nationality[])
    .transform(stringToNationality)
    .required("Nationality is required"),
  phone: phoneSchema,
  placement: placementSchema,
  status: statusSchema,
  work: workSchema,
  zoom: string().transform(emptyToNull).nullable().optional(),
});

// https://stackoverflow.com/questions/38275753/how-to-remove-empty-values-from-object-using-lodash
export const removeNullFromObject = (obj: object): object => {
  const objNoNull = omitBy(omitBy(obj, isNull), isUndefined);
  const subObjects = mapValues(omitBy(pickBy(objNoNull, isObject), isArray), removeNullFromObject);
  const subValues = omitBy(objNoNull, isObject);
  const subArrays = pickBy(objNoNull, isArray);
  forOwn(subArrays, (v, k) => {
    const arr: unknown[] = [];
    forEach(v, (item) => {
      arr.push(removeNullFromObject(item));
    });
    subArrays[k] = arr;
  });
  return merge(subObjects, subValues, subArrays);
};

export const setPrimaryNumberBooleanArray = (student?: Student) => {
  if (student) {
    const studentCopy = cloneDeep(student);
    studentCopy.phone.primaryPhone = map(studentCopy.phone.phoneNumbers, (num) => {
      return num.number === studentCopy.phone.primaryPhone;
    });
    return studentCopy;
  }
  return undefined;
};
