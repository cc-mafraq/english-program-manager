import { values } from "lodash";

/* eslint-disable typescript-sort-keys/string-enum */
export interface Student {
  academicRecords: AcademicRecord[];
  age?: number | "Unknown";
  certificateRequests?: string;
  city?: string;
  correspondence: Correspondence[];
  covidVaccine?: Covid;
  currentLevel?: GenderedLevel;
  email?: string;
  epId: number;
  familyCoordinatorEntry?: string;
  gender?: "M" | "F";
  imageName?: string;
  initialSession: string;
  literacy?: Literacy;
  name: StudentName;
  nationalID?: string;
  nationality?: Nationality;
  origPlacementData?: {
    adjustment?: string;
    examFile?: string;
    level?: Level;
    speaking?: LevelPlus;
    writing?: LevelPlus;
  };
  phone?: WhatsappInfo;
  photoContact?: string;
  placement: Placement[];
  status?: StudentStatus;
  work?: StudentWork;
  zoom?: string;
}

export interface AcademicRecord {
  attendance?: number;
  comments?: string;
  exitSpeakingExam?: Grade;
  exitWritingExam?: Grade;
  finalGrade?: Grade;
  finalGradeReportNotes?: string;
  finalGradeSentDate?: string;
  level?: string;
  levelAudited?: string;
  overallResult?: FinalResult;
  session: string;
}

export interface Covid {
  date?: string;
  imageName?: string;
  reason?: string;
  status: CovidStatus;
  suspectedFraud?: boolean;
  suspectedFraudReason?: string;
}

export interface Grade {
  notes?: string;
  percentage?: number;
  result?: FinalResult;
}

export interface SectionPlacement {
  classListNotes?: Correspondence[];
  date?: string;
  level: string;
  notes?: string;
  payments?: Payment[];
  section?: string;
  timestamp?: string;
}

export interface Placement {
  classScheduleSentDate?: string[];
  noAnswerClassScheduleWpm?: boolean;
  pending?: boolean;
  placement: SectionPlacement[];
  sectionsOffered?: string;
  session: string;
}

export interface Payment {
  amount: number;
  date?: string;
  notes?: string;
}

export interface StudentWork {
  englishTeacherLocation?: string;
  isEnglishTeacher?: boolean;
  isTeacher?: boolean;
  lookingForJob?: string;
  occupation: string;
  teachingSubjectAreas?: string;
}

export interface Literacy {
  illiterateAr?: boolean;
  illiterateEng?: boolean;
  tutorAndDate?: string;
}

export interface WhatsappInfo {
  otherWaBroadcastGroups?: string[];
  phoneNumbers: PhoneNumber[];
  // index of phoneNumbers
  primaryPhone: number | boolean[];
  waBroadcastSAR?: string;
}

export interface StudentStatus {
  cheatingSessions?: string[];
  currentStatus?: Status;
  droppedOutReason?: DroppedOutReason;
  idCardInBox?: boolean;
  inviteTag?: boolean;
  levelReevalDate?: string;
  noContactList?: boolean;
  reactivatedDate?: string[];
  withdrawDate?: string[];
}

export interface StudentName {
  arabic?: string;
  english: string;
}
export interface PhoneNumber {
  notes?: string;
  number: number | null;
}

export interface Correspondence {
  date: string | null;
  notes: string;
}

export interface Withdraw {
  droppedOutReason?: DroppedOutReason;
  inviteTag: boolean;
  noContactList: boolean;
  withdrawDate: string;
}

export type Level =
  | "PL1"
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5"
  | "L5 GRAD"
  | "A1"
  | "A2"
  | "B1"
  | "B1+"
  | "B2"
  | "C1"
  | "C2";

export type GenderedLevel = Level | ("PL1-M" | "PL1-W" | "L1-M" | "L1-W" | "L2-M" | "L2-W");

export type LevelPlus = Level | ("PL1+" | "L1-" | "L1+" | "L2-" | "L2+" | "L3-" | "L3+" | "L4-" | "L4+" | "L5-");

export enum CovidStatus {
  NORPT = "Not Reported",
  FULL = "Fully Vaccinated",
  PART = "Partially Vaccinated",
  UNV = "Unvaccinated",
  BOOST = "Boosted (Three Doses)",
  EXEMPT = "Exempt from Vaccine",
  DECL = "Declined to Provide Vaccine Info",
  UNCL = "Answered but Answer Unclear",
}

export enum Nationality {
  JDN = "Jordanian",
  SYR = "Syrian",
  ARG = "Argentinian",
  CEAFRRE = "Central African",
  CHI = "Chinese",
  EGY = "Egyptian",
  INDNES = "Indonesian",
  IRQ = "Iraqi",
  ITL = "Italian",
  KOR = "Korean",
  YEM = "Yemeni",
  UNKNWN = "Unknown",
}

export enum Status {
  NEW = "NEW",
  RET = "RET",
  WD = "WD",
}

export enum FinalResult {
  P = "P",
  F = "F",
  WD = "WD",
}

export enum StatusDetails {
  NORET = "Never returned after placement exam",
  WD1 = "Dropped out during 1st session",
  DO1 = "Dropped out after 1 session",
  DO2 = "Dropped out after 2 sessions",
  DO3 = "Dropped out after 3 or more sessions",
  SE = "Attended previous session & still enrolled",
  NEW = "Recently took placement exam, waiting to join next session",
  SES1 = "Still in 1st session",
  NEWWD = "Still in 1st session, but not the initial session of their placement exam",
  RETWD = "Returned after dropping out, but hasn't completed a session",
  SKIP = "Attended a session, skipped 1 or more sessions, & returned",
  ERR = "Error computing status details",
}

export enum DroppedOutReason {
  COVID = "COVID-19 Pandemic Related",
  FMEF = "Family Member or Employer Forbid Further Study",
  FTCLE = "Failed to Thrive in Classroom Environment",
  GRAD = "Graduated from L5",
  IP = "Illness or Pregnancy",
  JOB = "Got a Job",
  LCC = "Lack of Child-Care",
  LCM = "Lack of Commitment or Motivation",
  LFS = "Lack of Familial Support",
  LLMS = "Lack of Life Management Skills",
  LT = "Lack of Transport",
  MOVE = "Moved",
  TAW = "Tawjihi",
  TC = "Time Conflict",
  UNK = "Unknown",
  VP = "Vision Problems",
}

export const nationalities = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "American Samoan",
  "Andorran",
  "Angolan",
  "Anguillan",
  "Antarctic",
  "Antiguan or Barbudan",
  "Argentine",
  "Armenian",
  "Aruban",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Barthélemois",
  "Basotho",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bermudan",
  "Bhutanese",
  "Bissau-Guinean",
  "Bolivian",
  "Bonaire",
  "Bosnian or Herzegovinian",
  "Botswanan",
  "Bouvet Island",
  "Brazilian",
  "British",
  "British Virgin Island",
  "Bruneian",
  "Bulgarian",
  "Burkinabé",
  "Burmese",
  "Burundian",
  "Cabo Verdean",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Caymanian",
  "Central African",
  "Chadian",
  "Channel Island",
  "Chilean",
  "Chinese",
  "Christmas Island",
  "Cocos Island",
  "Colombian",
  "Comorian",
  "Congolese",
  "Cook Island",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Curaçaoan",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dutch",
  "Ecuadorian",
  "Egyptian",
  "Emirati",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Falkland Island",
  "Faroese",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "French Guianese",
  "French Polynesian",
  "French Southern Territories",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Gibraltar",
  "Greek",
  "Greenlandic",
  "Grenadian",
  "Guadeloupe",
  "Guamanian",
  "Guatemalan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Heard Island or McDonald Islands",
  "Honduran",
  "Hong Kong",
  "Hungarian",
  "I-Kiribati",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Kittitian or Nevisian",
  "Kuwaiti",
  "Kyrgyzstani",
  "Lao",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtenstein",
  "Lithuanian",
  "Luxembourgish",
  "Macanese",
  "Macedonian",
  "Mahoran",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malinese",
  "Maltese",
  "Manx",
  "Marshallese",
  "Martinican",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Montenegrin",
  "Montserratian",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepali",
  "New Caledonian",
  "New Zealand",
  "Ni-Vanuatu",
  "Nicaraguan",
  "Nigerian",
  "Nigerien",
  "Niuean",
  "Norfolk Island",
  "North Korean",
  "Northern Marianan",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Palestinian",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Pitcairn Island",
  "Polish",
  "Portuguese",
  "Puerto Rican",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Réunionese",
  "Sahrawi",
  "Saint Helenian",
  "Saint Lucian",
  "Saint Vincentian",
  "Saint-Martinoise",
  "Saint-Pierrais or Miquelonnais",
  "Salvadoran",
  "Sammarinese",
  "Samoan",
  "Saudi",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Sint Maarten",
  "Slovak",
  "Slovenian",
  "Solomon Island",
  "Somali",
  "South African",
  "South Georgia or South Sandwich Islands",
  "South Korean",
  "South Sudanese",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Svalbard",
  "Swazi",
  "Swedish",
  "Swiss",
  "Syrian",
  "São Toméan",
  "Taiwanese",
  "Tajikistani",
  "Tanzanian",
  "Thai",
  "Timorese",
  "Togolese",
  "Tokelauan",
  "Tongan",
  "Trinidadian or Tobagonian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Turks and Caicos Island",
  "Tuvaluan",
  "U.S. Virgin Island",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbekistani",
  "Vatican",
  "Venezuelan",
  "Vietnamese",
  "Wallis and Futuna",
  "Yemeni",
  "Zambian",
  "Zimbabwean",
];
// export const nationalities = values(Nationality);

export const levels: Level[] =
  import.meta.env.VITE_PROJECT_NAME === "ccm-english"
    ? ["PL1", "L1", "L2", "L3", "L4", "L5"]
    : ["A1", "A2", "B1", "B1+", "B2", "C1", "C2"];

export const genderedLevels: GenderedLevel[] =
  import.meta.env.VITE_PROJECT_NAME === "ccm-english"
    ? ["PL1-M", "PL1-W", "L1-M", "L1-W", "L2-M", "L2-W", "L3", "L4", "L5"]
    : levels;

export const levelsPlus: (LevelPlus | "Exempt")[] =
  import.meta.env.VITE_PROJECT_NAME === "ccm-english"
    ? [
        "PL1",
        "PL1+",
        "L1",
        "L1-",
        "L1+",
        "L2",
        "L2-",
        "L2+",
        "L3",
        "L3-",
        "L3+",
        "L4",
        "L4-",
        "L4+",
        "L5",
        "L5-",
        "Exempt",
      ]
    : levels;

export const statuses = values(Status);
export const statusDetails = values(StatusDetails);
export const covidStatuses = values(CovidStatus);

export const results = values(FinalResult);
export const PF = [FinalResult.P, FinalResult.F];

export const withdrawReasons = values(DroppedOutReason);

export const emptyStudent: Student =
  import.meta.env.VITE_PROJECT_NAME === "ccm-english"
    ? {
        academicRecords: [],
        age: "Unknown",
        correspondence: [],
        covidVaccine: {
          status: CovidStatus.NORPT,
        },
        currentLevel: "PL1",
        epId: 0,
        gender: "M",
        initialSession: "",
        literacy: {},
        name: {
          arabic: "N/A",
          english: "",
        },
        nationality: Nationality.UNKNWN,
        origPlacementData: {
          level: "PL1",
          speaking: "PL1",
          writing: "PL1",
        },
        phone: {
          phoneNumbers: [],
          primaryPhone: -1,
        },
        placement: [],
        status: {
          currentStatus: Status.NEW,
          inviteTag: false,
          noContactList: false,
          reactivatedDate: [],
          withdrawDate: [],
        },
        work: { occupation: "Unknown" },
      }
    : {
        academicRecords: [],
        correspondence: [],
        epId: 0,
        initialSession: "",
        name: {
          english: "",
        },
        placement: [],
      };

export const emptyAcademicRecord: AcademicRecord = {
  session: "",
};

export const emptyPlacement: Placement = {
  classScheduleSentDate: [],
  placement: [],
  session: "",
};
