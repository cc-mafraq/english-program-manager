import { array, bool, mixed, number, object, string } from "yup";
import { HighPriority, WaitlistOutcome } from "../interfaces";
import {
  correspondenceSchema,
  covidStatusSchema,
  dateSchema,
  emptyToNull,
  phoneNumberSchema,
  primaryPhoneSchema,
  stringToInteger,
} from "./studentFormService";

const optionalStringSchema = string().transform(emptyToNull).nullable().optional();

const stringToHighPriority = (value: string, originalValue: string) => {
  return originalValue as HighPriority;
};

const stringToWaitlistOutcome = (value: string, originalValue: string) => {
  return originalValue !== undefined ? (originalValue as WaitlistOutcome) : null;
};

export const waitingListFormSchema = object().shape({
  correspondence: array().of(correspondenceSchema),
  covidStatus: covidStatusSchema,
  covidVaccineNotes: optionalStringSchema,
  enteredInPhone: bool().optional(),
  entryDate: dateSchema.required("Entry date is required").typeError("Entry date is required"),
  highPriority: mixed<HighPriority>()
    .oneOf(Object.values(HighPriority) as HighPriority[])
    .transform(stringToHighPriority)
    .required("High priority is required"),
  name: optionalStringSchema,
  numPeople: number().transform(stringToInteger).optional().nullable(),
  outcome: mixed<WaitlistOutcome | null>()
    .oneOf([...Object.values(WaitlistOutcome), null] as WaitlistOutcome[])
    .transform(stringToWaitlistOutcome)
    .nullable()
    .optional(),
  phoneNumbers: array().of(phoneNumberSchema).min(1, "There must be at least 1 phone number"),
  placementExam: array().of(optionalStringSchema),
  primaryPhone: primaryPhoneSchema,
  probL3Plus: bool().optional(),
  probPL1: bool().optional(),
  referral: optionalStringSchema,
  transferralAndDate: object().shape({
    date: dateSchema.nullable(),
    transferral: optionalStringSchema,
  }),
  waiting: bool().required(),
});
