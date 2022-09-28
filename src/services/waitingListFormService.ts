import { array, bool, mixed, number, object, string } from "yup";
import { HighPriority, WaitlistOutcome, WaitlistStatus } from "../interfaces";
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
  return HighPriority[originalValue as keyof typeof HighPriority];
};

const stringToWaitlistOutcome = (value: string, originalValue: string) => {
  return originalValue ? WaitlistOutcome[originalValue as keyof typeof WaitlistOutcome] : null;
};

const stringToWaitlistStatus = (value: string, originalValue: string) => {
  return WaitlistStatus[originalValue as keyof typeof WaitlistStatus];
};

export const waitingListFormSchema = object().shape({
  correspondence: correspondenceSchema,
  covidStatus: covidStatusSchema,
  covidVaccineNotes: optionalStringSchema,
  enteredInPhone: bool().optional(),
  entryDate: dateSchema.required("Entry date is required").typeError("Entry date is required"),
  highPriority: mixed<HighPriority>()
    .oneOf(Object.values(HighPriority) as HighPriority[])
    .transform(stringToHighPriority)
    .required("High priority is required"),
  name: optionalStringSchema,
  numPeople: number().transform(stringToInteger).required("Number of people is required"),
  outcome: mixed<WaitlistOutcome>()
    .oneOf(Object.values(WaitlistOutcome) as WaitlistOutcome[])
    .transform(stringToWaitlistOutcome)
    .nullable()
    .optional(),
  phoneNumbers: array().of(phoneNumberSchema).min(1, "There must be at least 1 phone number"),
  placementExam: array().of(optionalStringSchema),
  primaryPhone: primaryPhoneSchema,
  probL3Plus: bool().optional(),
  probPL1: bool().optional(),
  referral: optionalStringSchema,
  status: mixed<WaitlistStatus>()
    .oneOf(Object.values(WaitlistStatus) as WaitlistStatus[])
    .transform(stringToWaitlistStatus)
    .required("Status is required"),
  transferralAndDate: object().shape({
    date: dateSchema,
    transferral: optionalStringSchema,
  }),
  waiting: bool().required(),
});
