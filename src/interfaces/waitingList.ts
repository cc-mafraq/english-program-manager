/* eslint-disable typescript-sort-keys/string-enum */
import { v4 } from "uuid";
import { Correspondence, CovidStatus, PhoneNumber } from "./student";

export interface WaitingListEntry {
  correspondence: Correspondence[];
  covidStatus: CovidStatus;
  covidVaccineNotes?: string;
  eligible?: boolean;
  enteredInPhone?: boolean;
  entryDate: string;
  gender?: "M" | "F" | "Mixed";
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
  timestamp?: string;
  transferDbDate?: string;
  waiting: boolean;
}

export enum HighPriority {
  YES = "Yes",
  NO = "No",
  PAST = "Past",
}

export enum WaitlistOutcome {
  NA = "NO ANSWER",
  NS = "NO SHOW",
  N = "NEW",
  WD = "WD",
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
  waiting: false,
};
