import { first, isEmpty, join, pullAll, replace, trim } from "lodash";
import { dateRegex, parseDateField, parseOptionalBoolean, parseOptionalString, parsePhone, splitAndTrim } from ".";
import {
  CovidStatus,
  HighPriority,
  TransferralAndDate,
  WaitingListStudent,
  WaitlistOutcome,
  WaitlistStatus,
} from "../interfaces";

export const parseWLWaiting = (key: string, value: string, wlStudent: WaitingListStudent) => {
  const valueInt = parseInt(value);
  if (valueInt > 0) {
    wlStudent.waiting = true;
    wlStudent.numStudents = valueInt;
  }
};

export const parseWLName = (key: string, value: string, wlStudent: WaitingListStudent) => {
  if (!value || value === "Unidentified") return;
  wlStudent.name = value;
};
export const parseWLPhone = parsePhone("phoneNumbers");
export const parseWLEntryDate = parseDateField("entryDate");

export const parseWLEnteredInPhone = (key: string, value: string, wlStudent: WaitingListStudent) => {
  if (!value) return;
  const lowerCaseValue = value.toLowerCase();
  if (lowerCaseValue === "yes" || lowerCaseValue === "y") {
    wlStudent.enteredInPhone = true;
  }
  if (lowerCaseValue === "no" || lowerCaseValue === "n") {
    wlStudent.enteredInPhone = true;
  }
};

export const parseWLReferral = parseOptionalString("referral");

export const parseWLCovidVaccineStatus = (key: string, value: string, wlStudent: WaitingListStudent) => {
  const valueInt = parseInt(value);
  if (valueInt === 3) {
    wlStudent.covidStatus = CovidStatus.UNV;
  }
  if (valueInt === 10) {
    wlStudent.covidStatus = CovidStatus.FULL;
  }
};

export const parseWLCovidVaccineNotes = parseOptionalString("covidVaccineNotes");

export const parseWLPlacementExam = (key: string, value: string, wlStudent: WaitingListStudent) => {
  wlStudent.placementExam = splitAndTrim(value, "//");
};

export const parseWLHighPriority = (key: string, value: string, wlStudent: WaitingListStudent) => {
  const valueInt = parseInt(value);
  if (valueInt === 3) {
    wlStudent.highPriority = HighPriority.YES;
  }
  if (valueInt === 22) {
    wlStudent.highPriority = HighPriority.PAST;
  }
};

export const parseWLStatus = (key: string, value: string, wlStudent: WaitingListStudent) => {
  const valueNoSpace = replace(value, /\s/g, "");
  if (valueNoSpace === "N/A") {
    wlStudent.status = WaitlistStatus.NA;
  } else if (valueNoSpace.includes("NEW")) {
    wlStudent.status = WaitlistStatus.NEW;
  } else {
    wlStudent.status = WaitlistStatus[valueNoSpace as keyof typeof WaitlistStatus];
  }
};

export const parseWLProbPL1 = parseOptionalBoolean("probPL1");
export const parseWLProbL3Plus = parseOptionalBoolean("probL3Plus");

export const parseWLTransferralAndDate = (key: string, value: string, wlStudent: WaitingListStudent) => {
  if (isEmpty(value)) return;
  const date = first(value.match(dateRegex));
  const newTransferralAndDate: TransferralAndDate = {};
  if (date) newTransferralAndDate.date = date;
  const transferral = trim(replace(join(pullAll(splitAndTrim(value, dateRegex), ["", "/", "-"])), ",", ""));
  if (transferral) newTransferralAndDate.transferral = transferral;
  if (date || transferral) wlStudent.transferralAndDate = newTransferralAndDate;
};

export const parseWLOutcome = (key: string, value: string, wlStudent: WaitingListStudent) => {
  if (Number(value) < 1) return;
  if (key.includes("WD")) wlStudent.outcome = WaitlistOutcome.WD;
  wlStudent.outcome = WaitlistOutcome[key as keyof typeof WaitlistOutcome];
  if (!wlStudent.waiting) wlStudent.numStudents += Number(value);
};
