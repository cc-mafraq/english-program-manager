import { indexOf, isEmpty, map } from "lodash";
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
  return parseInt(originalValue);
};

const emptyStringToNull = (value: string, originalValue: string) => {
  if (isEmpty(originalValue)) {
    return undefined;
  }
  return originalValue;
};
const percentageSchema = number().min(0).max(100).integer().optional();
const dateSchema = string(); // TODO: Date Validation

const gradeSchema = object()
  .shape({
    notes: string().optional(),
    percentage: percentageSchema,
    result: string().oneOf(results).required(),
  })
  .optional();

const academicRecordsSchema = object().shape({
  attendance: percentageSchema,
  certificate: bool().optional(),
  comments: string().optional(),
  electiveClass: string().optional(),
  exitSpeakingExam: gradeSchema,
  exitWritingExam: gradeSchema,
  finalResult: gradeSchema,
  level: string().oneOf(genderedLevels).optional(),
  levelAudited: string().oneOf(genderedLevels).optional(),
  session: string().required(),
});

const classListSchema = object().shape({
  classListSent: bool().optional(),
  classListSentDate: string().optional(),
  classListSentNotes: string().optional(),
});

const correspondenceSchema = object().shape({
  date: dateSchema.required(),
  notes: string().required(),
});

const literacySchema = object().shape({
  illiterateAr: bool().optional(),
  illiterateEng: bool().optional(),
  tutorAndDate: string().optional(),
});

const nameSchema = object()
  .shape({
    arabic: string().required('arabic name is a required field. You may write "N/A"'),
    english: string().required(),
  })
  .required();

const phoneNumberSchema = object()
  .shape({
    notes: string().optional(),
    number: number()
      .transform(emptyStringToNull)
      .transform(stringToInteger)
      .test("valid-phone-number", "The phone number is not valid", (value) => {
        return (
          value !== undefined &&
          ((value > 700000000 && value < 800000000) ||
            (value > 201200000000 && value < 201300000000))
        );
      })
      .required(),
  })
  .required();

const phoneSchema = object()
  .shape({
    hasWhatsapp: bool().required(),
    otherWaBroadcastGroups: array().of(string()).transform(stringToArray).optional(),
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
    waBroadcastSAR: string().optional(),
    whatsappNotes: string().optional(),
  })
  .required();

const placementSchema = object().shape({
  confDate: array().of(string()).transform(stringToArray).optional(),
  noAnswerClassScheduleDate: dateSchema.optional(),
  notified: bool().optional(),
  origPlacementData: object()
    .shape({
      adjustment: string().optional(),
      level: string().oneOf(levels).required(),
      speaking: string().oneOf(levelsPlus).required(),
      writing: string().oneOf(levelsPlus).required(),
    })
    .required(),
  pending: bool().optional(),
  photoContact: array().of(string()).transform(stringToArray).optional(),
  placement: array().of(string()).transform(stringToArray).optional(),
  sectionsOffered: string().optional(),
});

const statusSchema = object().shape({
  audit: bool().optional(),
  currentStatus: string().oneOf(statuses).required(),
  droppedOutReason: string().oneOf(withdrawReasons).optional(),
  finalGradeSentDate: dateSchema.optional(),
  inviteTag: bool().required(),
  levelReevalDate: dateSchema.optional(),
  noContactList: bool().required(),
  reactivatedDate: array().of(dateSchema).transform(stringToArray).optional(),
  withdrawDate: array().of(dateSchema).transform(stringToArray).optional(),
});

const workSchema = object().shape({
  englishTeacherLocation: string().optional(),
  isEnglishTeacher: bool().optional(),
  isTeacher: bool().optional(),
  lookingForJob: string().optional(),
  occupation: string().required(),
  teachingSubjectAreas: string().optional(),
});

export const studentFormSchema = object().shape({
  academicRecords: array().of(academicRecordsSchema),
  age: number()
    .transform(emptyStringToNull)
    .transform(stringToInteger)
    .min(13)
    .max(99)
    .integer()
    .required(),
  certificateRequests: string().optional(),
  classList: classListSchema,
  correspondence: array().of(correspondenceSchema),
  currentLevel: string().oneOf(genderedLevels).required(),
  epId: number().min(10000).max(99999).integer().required(),
  gender: string().oneOf(["M", "F"]).required(),
  initialSession: string()
    .matches(/(FA|SP) (I|II) \d{2}/)
    .required(),
  literacy: literacySchema,
  name: nameSchema,
  nationality: string().oneOf(nationalities).required(),
  phone: phoneSchema,
  placement: placementSchema,
  status: statusSchema,
  work: workSchema,
  zoom: string().optional(),
});
