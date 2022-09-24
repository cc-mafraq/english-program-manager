/* eslint-disable typescript-sort-keys/string-enum */
import { v4 } from "uuid";
import { Correspondence, CovidStatus, PhoneNumber } from "./student";

export interface WaitingListEntry {
  correspondence: Correspondence[];
  covidStatus: CovidStatus;
  covidVaccineNotes?: string;
  enteredInPhone?: boolean;
  entryDate: string;
  highPriority: HighPriority;
  id: string;
  name?: string;
  numPeople: number;
  outcome?: WaitlistOutcome;
  phoneNumbers: PhoneNumber[];
  placementExam: string[];
  primaryPhone: number;
  probL3Plus?: boolean;
  probPL1?: boolean;
  referral?: string;
  status: WaitlistStatus;
  transferralAndDate?: TransferralAndDate;
  waiting: boolean;
}

export interface TransferralAndDate {
  date?: string;
  transferral?: string;
}

export enum HighPriority {
  NO = "No",
  YES = "Yes",
  PAST = "Past",
}

export enum WaitlistStatus {
  POT = "Potential",
  NEW = "New",
  WD = "Withdrawn",
  UNC = "Unclear",
  BLOCKED = "Blocked",
  NA = "Not Applicable",
  ALREADEST = "Already Student",
}

export enum WaitlistOutcome {
  NA = "No Answer",
  NS = "No Show",
  N = "New",
  WD = "Withdrawn",
}

export const emptyWaitingListEntry: WaitingListEntry = {
  correspondence: [],
  covidStatus: CovidStatus.NORPT,
  entryDate: "",
  highPriority: HighPriority.NO,
  id: v4(),
  numPeople: 0,
  phoneNumbers: [],
  placementExam: [],
  primaryPhone: -1,
  status: WaitlistStatus.POT,
  waiting: false,
};
