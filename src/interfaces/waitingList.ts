/* eslint-disable typescript-sort-keys/string-enum */
import { v4 } from "uuid";
import { Correspondence, CovidStatus, PhoneNumber } from "./student";

export interface WaitingListStudent {
  correspondence: Correspondence[];
  covidStatus: CovidStatus;
  covidVaccineNotes?: string;
  enteredInPhone?: boolean;
  entryDate: string;
  highPriority: HighPriority;
  id: string;
  name?: string;
  numStudents: number;
  outcome?: WaitlistOutcome;
  phoneNumbers: PhoneNumber[];
  placementExam: string[];
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

export const emptyWaitListStudent: WaitingListStudent = {
  correspondence: [],
  covidStatus: CovidStatus.NORPT,
  entryDate: "",
  highPriority: HighPriority.NO,
  id: v4(),
  numStudents: 0,
  phoneNumbers: [],
  placementExam: [],
  status: WaitlistStatus.POT,
  waiting: false,
};
