import {
  indexOf,
  isEmpty,
  isNaN,
  isNull,
  isObject,
  map,
  mapValues,
  merge,
  omitBy,
  pickBy,
} from "lodash";
import { array, bool, number, object, string } from "yup";
import {
  genderedLevels,
  levels,
  levelsPlus,
  nationalities,
  results,
  statuses,
  withdrawReasons,
} from "../interfaces";

const stringToArray = (value: string, originalValue: string) => {
  // TODO: Transform string to array
};

const stringToInteger = (value: string, originalValue: string) => {
  const parsedInt = parseInt(originalValue);
  return isNaN(parsedInt) ? undefined : parsedInt;
};

const emptyToNull = (value: string, originalValue: string) => {
  if (isEmpty(originalValue)) {
    return null;
  }
  return originalValue;
};
const percentageSchema = number().min(0).max(100).integer().optional();
const dateSchema = string(); // TODO: Date Validation

const gradeSchema = object()
  .shape({
    notes: string().transform(emptyToNull).nullable().optional(),
    percentage: percentageSchema.transform(emptyToNull).nullable(),
    result: string().oneOf(results).required("result is required"),
  })
  .optional();

const academicRecordsSchema = object().shape({
  attendance: percentageSchema.transform(emptyToNull).nullable(),
  certificate: bool().optional(),
  comments: string().transform(emptyToNull).nullable().optional(),
  electiveClass: string().transform(emptyToNull).nullable().optional(),
  exitSpeakingExam: gradeSchema,
  exitWritingExam: gradeSchema,
  finalResult: gradeSchema,
  level: string().oneOf(genderedLevels).transform(emptyToNull).nullable().optional(),
  levelAudited: string().oneOf(genderedLevels).transform(emptyToNull).nullable().optional(),
  session: string().required("session is required"),
});

const classListSchema = object().shape({
  classListSent: bool().optional(),
  classListSentDate: string().transform(emptyToNull).nullable().optional(),
  classListSentNotes: string().transform(emptyToNull).nullable().optional(),
});

const correspondenceSchema = object().shape({
  date: dateSchema.required("date is required"),
  notes: string().required(
    "correspondence notes are required if added. You can remove the correspondence by clicking the X button",
  ),
});

const literacySchema = object().shape({
  illiterateAr: bool().optional(),
  illiterateEng: bool().optional(),
  tutorAndDate: string().transform(emptyToNull).nullable().optional(),
});

const nameSchema = object()
  .shape({
    arabic: string().required('arabic name is required. You may write "N/A"'),
    english: string().required("english name is required"),
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
        "phone number is required if added. You can remove the correspondence by clicking the X button",
      ),
  })
  .required();

const phoneSchema = object()
  .shape({
    hasWhatsapp: bool().required(),
    otherWaBroadcastGroups: array()
      .of(string())
      .transform(stringToArray)
      .transform(emptyToNull)
      .nullable()
      .optional(),
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
  confDate: array()
    .of(string())
    .transform(stringToArray)
    .transform(emptyToNull)
    .nullable()
    .optional(),
  noAnswerClassScheduleDate: dateSchema.transform(emptyToNull).nullable().optional(),
  notified: bool().optional(),
  origPlacementData: object()
    .shape({
      adjustment: string().transform(emptyToNull).nullable().optional(),
      level: string().oneOf(levels).required("original placement level is required"),
      speaking: string().oneOf(levelsPlus).required("original speaking placement is required"),
      writing: string().oneOf(levelsPlus).required("original writing placement is required"),
    })
    .required(),
  pending: bool().optional(),
  photoContact: array()
    .of(string())
    .transform(stringToArray)
    .transform(emptyToNull)
    .nullable()
    .optional(),
  placement: array()
    .of(string())
    .transform(stringToArray)
    .transform(emptyToNull)
    .nullable()
    .optional(),
  sectionsOffered: string().transform(emptyToNull).nullable().optional(),
});

const statusSchema = object().shape({
  audit: bool().optional(),
  currentStatus: string().oneOf(statuses).required("current status is required"),
  droppedOutReason: string().oneOf(withdrawReasons).transform(emptyToNull).nullable().optional(),
  finalGradeSentDate: dateSchema.transform(emptyToNull).nullable().optional(),
  inviteTag: bool().required(),
  levelReevalDate: dateSchema.transform(emptyToNull).nullable().optional(),
  noContactList: bool().required(),
  reactivatedDate: array()
    .of(dateSchema)
    .transform(stringToArray)
    .transform(emptyToNull)
    .nullable()
    .optional(),
  withdrawDate: array()
    .of(dateSchema)
    .transform(stringToArray)
    .transform(emptyToNull)
    .nullable()
    .optional(),
});

const workSchema = object().shape({
  englishTeacherLocation: string().transform(emptyToNull).nullable().optional(),
  isEnglishTeacher: bool().optional(),
  isTeacher: bool().optional(),
  lookingForJob: string().transform(emptyToNull).nullable().optional(),
  occupation: string().required("occupation is required"),
  teachingSubjectAreas: string().transform(emptyToNull).nullable().optional(),
});

export const studentFormSchema = object().shape({
  academicRecords: array().of(academicRecordsSchema),
  age: number()
    .transform(emptyToNull)
    .transform(stringToInteger)
    .min(13)
    .max(99)
    .integer()
    .required("age is required"),
  certificateRequests: string().transform(emptyToNull).nullable().optional(),
  classList: classListSchema,
  correspondence: array().of(correspondenceSchema),
  currentLevel: string().oneOf(genderedLevels).required("current level is required"),
  epId: number().min(10000).max(99999).integer().required("id is required"),
  gender: string().oneOf(["M", "F"]).required("gender is required"),
  initialSession: string()
    .matches(/(FA|SP) (I|II) \d{2}/)
    .required("initial session is required"),
  literacy: literacySchema,
  name: nameSchema,
  nationality: string().oneOf(nationalities).required("nationality is required"),
  phone: phoneSchema,
  placement: placementSchema,
  status: statusSchema,
  work: workSchema,
  zoom: string().transform(emptyToNull).nullable().optional(),
});

// https://stackoverflow.com/questions/38275753/how-to-remove-empty-values-from-object-using-lodash
export const removeNullFromObject = (obj: object): object => {
  const objNoNull = omitBy(obj, isNull);
  const subObjects = mapValues(pickBy(objNoNull, isObject), removeNullFromObject);
  const subValues = omitBy(objNoNull, isObject);
  return merge(subObjects, subValues);
};
