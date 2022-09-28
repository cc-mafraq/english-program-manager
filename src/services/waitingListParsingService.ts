import { filter, first, isEmpty, join, pullAll, replace, trim } from "lodash";
import {
  CovidStatus,
  HighPriority,
  TransferralAndDate,
  WaitingListEntry,
  WaitlistOutcome,
  WaitlistStatus,
} from "../interfaces";
import {
  dateRegex,
  parseDateField,
  parseOptionalBoolean,
  parseOptionalString,
  parsePhone,
  splitAndTrim,
} from "./studentParsingService";

export const parseWLWaiting = (key: string, value: string, wlEntry: WaitingListEntry) => {
  const valueInt = parseInt(value);
  if (valueInt > 0) {
    wlEntry.waiting = true;
    wlEntry.numPeople = valueInt;
  }
};

export const parseWLName = (key: string, value: string, wlEntry: WaitingListEntry) => {
  if (!value || value === "Unidentified") return;
  wlEntry.name = value;
};
export const parseWLPhone = parsePhone("phoneNumbers");
export const parseWLEntryDate = parseDateField("entryDate");

export const parseWLEnteredInPhone = (key: string, value: string, wlEntry: WaitingListEntry) => {
  if (!value) return;
  const lowerCaseValue = value.toLowerCase();
  if (lowerCaseValue === "yes" || lowerCaseValue === "y") {
    wlEntry.enteredInPhone = true;
  }
  if (lowerCaseValue === "no" || lowerCaseValue === "n") {
    wlEntry.enteredInPhone = true;
  }
};

export const parseWLReferral = parseOptionalString("referral");

export const parseWLCovidVaccineStatus = (key: string, value: string, wlEntry: WaitingListEntry) => {
  const valueInt = parseInt(value);
  if (valueInt === 3) {
    wlEntry.covidStatus = CovidStatus.NORPT;
  }
  if (valueInt === 10) {
    wlEntry.covidStatus = CovidStatus.FULL;
  }
};

export const parseWLCovidVaccineNotes = parseOptionalString("covidVaccineNotes");

export const parseWLPlacementExam = (key: string, value: string, wlEntry: WaitingListEntry) => {
  wlEntry.placementExam = filter(splitAndTrim(value, "//"), (pe) => {
    return !isEmpty(pe);
  });
};

export const parseWLHighPriority = (key: string, value: string, wlEntry: WaitingListEntry) => {
  const valueInt = parseInt(value);
  if (valueInt === 3) {
    wlEntry.highPriority = HighPriority.YES;
  } else if (valueInt === 22) {
    wlEntry.highPriority = HighPriority.PAST;
  } else {
    wlEntry.highPriority = HighPriority.NO;
  }
};

export const parseWLStatus = (key: string, value: string, wlEntry: WaitingListEntry) => {
  if (isEmpty(value)) return;
  const valueNoSpace = replace(value, /\s/g, "");
  if (valueNoSpace === "N/A") {
    wlEntry.status = WaitlistStatus.NA;
  } else if (valueNoSpace.includes("NEW")) {
    wlEntry.status = WaitlistStatus.NEW;
  } else {
    const status = WaitlistStatus[valueNoSpace as keyof typeof WaitlistStatus];
    if (status !== undefined) {
      wlEntry.status = status;
    }
  }
};

export const parseWLProbPL1 = parseOptionalBoolean("probPL1");
export const parseWLProbL3Plus = parseOptionalBoolean("probL3Plus");

export const parseWLTransferralAndDate = (key: string, value: string, wlEntry: WaitingListEntry) => {
  if (isEmpty(value)) return;
  const date = first(value.match(dateRegex));
  const newTransferralAndDate: TransferralAndDate = {};
  if (date) newTransferralAndDate.date = date;
  const transferral = trim(replace(join(pullAll(splitAndTrim(value, dateRegex), ["", "/", "-"])), ",", ""));
  if (transferral) newTransferralAndDate.transferral = transferral;
  if (date || transferral) wlEntry.transferralAndDate = newTransferralAndDate;
};

export const parseWLOutcome = (key: string, value: string, wlEntry: WaitingListEntry) => {
  if (isEmpty(value) || Number(value) < 1) return;
  if (key.includes("WD")) wlEntry.outcome = WaitlistOutcome.WD;
  const outcome = WaitlistOutcome[key as keyof typeof WaitlistOutcome];
  if (outcome !== undefined) {
    wlEntry.outcome = outcome;
  }
  if (!wlEntry.waiting) wlEntry.numPeople += Number(value);
};
