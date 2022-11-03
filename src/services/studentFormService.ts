import {
  cloneDeep,
  filter,
  forEach,
  forOwn,
  get,
  includes,
  indexOf,
  isArray,
  isEmpty,
  isInteger,
  isNaN,
  isNull,
  isObject,
  isUndefined,
  lowerCase,
  map,
  mapValues,
  merge,
  omitBy,
  pickBy,
  set,
  some,
  split,
  startsWith,
  toString,
  trim,
  values,
} from "lodash";
import moment from "moment";
import { array, bool, mixed, number, object, string } from "yup";
import {
  CovidStatus,
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
} from "../interfaces";

export const SPACING = 2;
export const MOMENT_FORMAT = "l";
const sessionRegex = /(Fa|Sp) (I|II) \d{2}/;

export interface FormItem {
  children?: React.ReactNode;
  index?: number;
  name?: string;
  removeItem?: (index?: number) => () => void;
}

export const stringToArray = (value: string, originalValue: string) => {
  const separators = /,|;/;
  return originalValue
    ? isArray(originalValue)
      ? some(originalValue)
        ? originalValue
        : null
      : originalValue.match(separators)
      ? map(split(originalValue, separators), (v) => {
          return trim(v);
        })
      : [originalValue]
    : null;
};

export const dateStringToArray = (value: string, originalValue: string) => {
  return isArray(originalValue) && some(originalValue) ? originalValue : [];
};

export const stringToInteger = (value: string, originalValue: string) => {
  if (lowerCase(originalValue) === "unknown") return originalValue;
  const parsedInt = parseInt(originalValue);
  return isNaN(parsedInt) ? undefined : parsedInt;
};

const stringToStatus = (value: string, originalValue: string) => {
  return Status[originalValue as keyof typeof Status];
};

export const stringToCovidStatus = (value: string, originalValue: string) => {
  return originalValue as CovidStatus;
};

const stringToNationality = (value: string, originalValue: string) => {
  return originalValue as Nationality;
};

const stringToResult = (value: string, originalValue: string) => {
  return originalValue ? FinalResult[originalValue as keyof typeof FinalResult] : null;
};

export const dateToString = (value: string, originalValue: string) => {
  if (isEmpty(originalValue)) return null;
  const momentVal = moment(originalValue, MOMENT_FORMAT);
  return momentVal.isValid() ? momentVal.format(MOMENT_FORMAT) : moment(originalValue).format(MOMENT_FORMAT);
};

export const emptyToNull = (value: string, originalValue: string) => {
  return isEmpty(originalValue) ? null : originalValue;
};

export const stringToPhoneNumber = (value: string, originalValue: string) => {
  const numberNoSpacesOrSpecialChars = toString(originalValue).replace(/[-()+\s]/g, "");
  const numberNoCountryCode = numberNoSpacesOrSpecialChars.startsWith("962")
    ? numberNoSpacesOrSpecialChars.slice(3)
    : numberNoSpacesOrSpecialChars;
  const parsedInt = parseInt(numberNoCountryCode);
  return isNaN(parsedInt) ? undefined : parsedInt;
};

const percentageToInteger = (value: string, originalValue: string) => {
  const percentageNoSymbol = toString(originalValue).replace("%", "");
  if (!percentageNoSymbol) return null;
  const percentageInt = parseInt(percentageNoSymbol);
  return isNaN(percentageInt) ? originalValue : percentageInt;
};

const percentError = "Percentage must be an integer between 0 and 100";
const percentageSchema = number()
  .min(0, percentError)
  .max(100, percentError)
  .integer()
  .transform(percentageToInteger)
  .typeError(percentError)
  .nullable()
  .optional();

// https://www.regular-expressions.info/dates.html
export const dateSchema = string()
  .matches(
    /^([1-9]|1[012])[- /.]([1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/,
    "Invalid date format. The format must be MM/DD/YY",
  )
  .transform(dateToString);

const finalResultSchema = mixed<FinalResult>()
  .oneOf([...(Object.values(FinalResult) as FinalResult[]), null])
  .transform(stringToResult)
  .nullable()
  .optional();

const gradeSchema = object()
  .shape({
    notes: string().transform(emptyToNull).nullable().optional(),
    percentage: percentageSchema,
    result: finalResultSchema,
  })
  .optional();

export const academicRecordsSchema = object().shape({
  attendance: percentageSchema,
  comments: string().transform(emptyToNull).nullable().optional(),
  exitSpeakingExam: gradeSchema,
  exitWritingExam: gradeSchema,
  finalGrade: gradeSchema,
  finalGradeReportNotes: string().transform(emptyToNull).nullable().optional(),
  finalGradeSentDate: dateSchema.nullable().optional(),
  level: mixed<GenderedLevel>().transform(emptyToNull).nullable().optional(),
  levelAudited: mixed<GenderedLevel>().transform(emptyToNull).nullable().optional(),
  overallResult: finalResultSchema,
  session: string().typeError("Session is required").required("Session is required"),
});

export const correspondenceSchema = object().shape({
  date: dateSchema.required("Correspondence date is required").typeError("Correspondence date is required"),
  notes: string().required(
    "Correspondence notes are required if added. You can remove the correspondence by clicking the ❌ button",
  ),
});

export const covidStatusSchema = mixed<CovidStatus>()
  .oneOf(values(CovidStatus))
  .transform(stringToCovidStatus)
  .required("Vaccine status is required");

const covidSchema = object().shape({
  date: dateSchema.nullable().optional(),
  reason: string().transform(emptyToNull).nullable().optional(),
  status: covidStatusSchema,
  suspectedFraud: bool().optional(),
  suspectedFraudReason: string().transform(emptyToNull).nullable().optional(),
});

const literacySchema = object().shape({
  illiterateAr: bool().optional(),
  illiterateEng: bool().optional(),
  tutorAndDate: string().transform(emptyToNull).nullable().optional(),
});

const nameSchema = object()
  .shape({
    arabic: string()
      .matches(/^[\u0621-\u064A\s]+|(N\/A)/, "Arabic name must be arabic characters or N/A")
      .required("Arabic name is required. You may write N/A"),
    english: string().required("English name is required"),
  })
  .required();

export const primaryPhoneSchema = number()
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
  .required();

export const phoneNumberSchema = object()
  .shape({
    notes: string().transform(emptyToNull).nullable().optional(),
    number: number()
      .transform(stringToPhoneNumber)
      .test("valid-phone-number", "The phone number is not valid", (value) => {
        return (
          value !== undefined && ((value > 700000000 && value < 800000000) || !startsWith(toString(value), "7"))
        );
      })
      .required("Phone number is required if added. You can remove the phone number by clicking the ❌ button"),
  })
  .required();

const phoneSchema = object()
  .shape({
    otherWaBroadcastGroups: array().of(string()).transform(stringToArray).nullable().optional(),
    phoneNumbers: array().of(phoneNumberSchema).min(1, "There must be at least 1 phone number"),
    primaryPhone: primaryPhoneSchema,
    waBroadcastSAR: string().transform(emptyToNull).nullable().optional(),
    whatsappNotes: string().transform(emptyToNull).nullable().optional(),
  })
  .required();

const sectionPlacementSchema = object().shape({
  notes: string().transform(emptyToNull).nullable().optional(),
  sectionAndDate: string().required(
    "Placement is required if added. You can remove the placement by clicking the ❌ button",
  ),
});

export const placementSchema = object().shape({
  classScheduleSentDate: array().of(dateSchema.nullable().optional()).transform(dateStringToArray).required(),
  noAnswerClassScheduleWPM: bool().optional(),
  pending: bool().optional(),
  photoContact: dateSchema.nullable().optional(),
  placement: array().of(sectionPlacementSchema).default([]).required(),
  sectionsOffered: string().transform(emptyToNull).nullable().optional(),
});

const statusSchema = object().shape({
  cheatingSessions: array()
    .of(
      string()
        .matches(sessionRegex, "must be Fa/Sp I/II year (e.g. Sp I 22)")
        .transform(emptyToNull)
        .nullable()
        .optional(),
    )
    .optional(),
  currentStatus: mixed<Status>()
    .oneOf(Object.values(Status) as Status[])
    .transform(stringToStatus)
    .required("Current status is required"),
  droppedOutReason: mixed<DroppedOutReason>()
    .oneOf([...(Object.values(DroppedOutReason) as DroppedOutReason[]), null])
    .transform(emptyToNull)
    .nullable()
    .optional(),
  inviteTag: bool().required(),
  levelReevalDate: dateSchema.nullable().optional(),
  noContactList: bool().required(),
  reactivatedDate: array().of(dateSchema.nullable().optional()).transform(dateStringToArray).required(),
  withdrawDate: array().of(dateSchema.nullable().optional()).transform(dateStringToArray).required(),
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
  age: mixed<number | "Unknown">()
    .transform(stringToInteger)
    .test(
      "valid-age",
      'Age must be an integer greater than 12 and less than 100. You can enter "Unknown"',
      (value) => {
        return (
          (isInteger(value) && value && value > 12 && value < 100) || lowerCase(value as string) === "unknown"
        );
      },
    )
    .required("Age is required"),
  certificateRequests: string().transform(emptyToNull).nullable().optional(),
  correspondence: array().of(correspondenceSchema),
  covidVaccine: covidSchema,
  currentLevel: mixed<GenderedLevel>()
    .oneOf([...genderedLevels, "L5 GRAD"])
    .required("Current level is required"),
  epId: number()
    .min(10000, "ID must be between 10000 and 99999")
    .max(99999, "ID must be between 10000 and 99999")
    .integer()
    .required("ID is required"),
  familyCoordinatorEntry: string().transform(emptyToNull).nullable().optional(),
  gender: mixed<"M" | "F">().oneOf(["M", "F"]).required("Gender is required"),
  initialSession: string()
    .matches(sessionRegex, "Initial session must be Fa/Sp I/II year (e.g. Sp I 22)")
    .typeError("Initial session is required")
    .required("Initial session is required"),
  literacy: literacySchema,
  name: nameSchema,
  nationality: mixed<Nationality>()
    .oneOf(Object.values(Nationality) as Nationality[])
    .transform(stringToNationality)
    .required("Nationality is required"),
  origPlacementData: object()
    .shape({
      adjustment: string().transform(emptyToNull).nullable().optional(),
      level: mixed<Level>().oneOf(levels).required("Original placement level is required"),
      speaking: mixed<LevelPlus | "Exempt">()
        .oneOf(levelsPlus)
        .required("Original speaking placement is required"),
      writing: mixed<LevelPlus | "Exempt">().oneOf(levelsPlus).required("Original writing placement is required"),
    })
    .required(),
  phone: phoneSchema,
  placement: placementSchema,
  status: statusSchema,
  work: workSchema,
  zoom: string().transform(emptyToNull).nullable().optional(),
});

// https://stackoverflow.com/questions/38275753/how-to-remove-empty-values-from-object-using-lodash
export const removeNullFromObject = (obj: object): object => {
  const removeNullFromArray = (arr: unknown[]): unknown[] => {
    return filter(
      map(arr, (v) => {
        return isObject(v) ? removeNullFromObject(v) : v;
      }),
      (v) => {
        return !isNull(v) && !isUndefined(v);
      },
    );
  };
  const objNoNull = omitBy(omitBy(obj, isNull), isUndefined);
  const subObjects = mapValues(omitBy(pickBy(objNoNull, isObject), isArray), removeNullFromObject);
  const subValues = omitBy(objNoNull, isObject);
  const subArrays = pickBy(objNoNull, isArray);
  forOwn(subArrays, (v, k) => {
    subArrays[k] = removeNullFromArray(v);
  });
  return merge(subObjects, subValues, subArrays);
};

export const setPrimaryNumberBooleanArray = <T extends object>(data: T | null, phonePath: string) => {
  if (data) {
    const dataCopy = cloneDeep(data);
    const subPath = includes(phonePath, ".") ? phonePath.substring(0, indexOf(phonePath, ".") + 1) : "";
    const primaryPhoneBooleanArray = map(get(dataCopy, phonePath), (num) => {
      return num.number === get(dataCopy, `${subPath}primaryPhone`);
    });
    set(dataCopy, `${subPath}primaryPhone`, primaryPhoneBooleanArray);
    return dataCopy;
  }
  return undefined;
};

export const getListOfErrors = (formErrors: object): string[] => {
  const errorMessages: string[] = [];
  forOwn(formErrors, (value, key) => {
    if (isObject(value) && key !== "ref") {
      forEach(getListOfErrors(value), (errorMessage) => {
        errorMessages.push(errorMessage);
      });
    }
    if (key === "message") {
      errorMessages.push(value);
    }
  });
  return errorMessages;
};

export const withdrawSchema = object().shape({
  droppedOutReason: mixed<DroppedOutReason>()
    .oneOf([...(Object.values(DroppedOutReason) as DroppedOutReason[]), null])
    .transform(emptyToNull)
    .nullable()
    .optional(),
  inviteTag: bool().required(),
  noContactList: bool().required(),
  withdrawDate: dateSchema,
});
