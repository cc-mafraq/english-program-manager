export interface Student {
  academicRecords: AcademicRecord[];
  age?: number;
  certificateRequests?: string;
  classList?: ClassList;
  correspondence: string;
  currentLevel: GenderedLevel;
  droppedOutReason?: DroppedOutReason;
  droppedOutTiming?: DroppedOutTiming;
  epId: number;
  gender: "M" | "F";
  initialSession: string;
  literacy?: Literacy;
  name: StudentName;
  nationality: Nationality;
  phone: WhatsappInfo;
  placement: Placement;
  status: StudentStatus;
  work: StudentWork;
  zoom?: string;
}

export interface AcademicRecord {
  attendance?: string;
  certificate?: boolean;
  comments?: string;
  electiveClass?: string;
  exitSpeakingExam?: string;
  exitWritingExam?: string;
  finalGrade?: string;
  finalGradeReportSentDate?: string;
  level: Level;
  result: FinalResult;
  session: string;
}

export interface Placement {
  confDate?: string;
  notified?: boolean;
  pending?: boolean;
  photoContact?: boolean;
  photoContactDate?: string;
  placement?: string;
  placementData: {
    level: Level;
    speaking: LevelPlus;
    writing: LevelPlus;
  };
}

export interface StudentWork {
  englishTeacherLocation?: string;
  lookingForJob?: string;
  occupation: string;
  teacher?: boolean;
  teachingSubjectAreas?: string;
}

export interface Literacy {
  illiterateAr?: boolean;
  illiterateEng: boolean;
  tutor?: string;
  tutorDate?: string;
}

export interface WhatsappInfo {
  hasWhatsapp: boolean;
  otherWaBroadcastGroups?: string[];
  // index of phoneNumbers
  phoneNumbers: PhoneNumber[];
  primaryPhone: number;
  waBroadcastSAR: string;
  whatsappNotes?: string;
}

export interface StudentStatus {
  audit?: boolean;
  currentStatus: Status;
  inviteTag: boolean;
  noCallList: boolean;
  reactivatedDate?: string;
  sectionsOffered?: string[];
  withdrawDate?: string;
}

export interface ClassList {
  classListSent?: string;
  classListSentDate?: string;
  classListSentNotes?: string;
}

export interface StudentName {
  arabic: string;
  english: string;
}
export interface PhoneNumber {
  notes?: string;
  number: number;
}

export type Level = "PL1" | "L1" | "L2" | "L3" | "L4" | "L5" | "L5 GRAD";

export type GenderedLevel = Level | ("PL1-M" | "PL1-W" | "L1-M" | "L1-W" | "L2-M" | "L2-W");

export type LevelPlus =
  | Level
  | ("PL1+" | "L1-" | "L1+" | "L2-" | "L2+" | "L3-" | "L3+" | "L4-" | "L4+" | "L5-");

export enum Nationality {
  JRD,
  SYR,
  IRQ,
  EGY,
  INDNES,
  YEM,
  CEAFRE,
  CHI,
  KOR,
  UNK,
}

export enum Status {
  NEW,
  RET,
  WD,
  NCL,
}

export enum FinalResult {
  P,
  F,
  WD,
}

export enum DroppedOutTiming {
  DO1 = "Dropped out after 1 ses",
  DO2 = "Dropped out after 2 ses",
  DO3 = "Dropped out after 3 or more ses",
  SE = "Attended Previous Session(s) & Still Enrolled",
  SES1 = "Still in 1st Session",
  SKIP = "Attended a Session, Skipped a Session, & Returned",
  WD1 = "WD 1st ses or never returned after PE",
}

export enum DroppedOutReason {
  COVID = "COVID-19 Pandemic Related",
  FMEF = "Family Member or Employer Forbid Further Study",
  FTCLE = "Failed to Thrive in Clsrm Env",
  GRAD = "Graduated from L5",
  IP = "Illness or Pregnancy",
  JOB = "Got a Job",
  LCC = "Lack of Child-Care",
  LCM = "Lack of Commitment or Motivation",
  LFS = "Lack of Familial Support",
  LLMS = "Lack of Life Mgm Skills",
  LT = "Lack of Transport",
  MOVE = "Moved",
  TC = "Time Conflict",
  UNK = "Unknown",
  VP = "Vision Problems",
}

export const SAMPLE_STUDENTS: Student[] = [
  {
    academicRecords: [],
    age: 19,
    correspondence:
      "11/13/19: his friend Mohammed Khalid (PL1-M Fa I 19) says Bahaa doesn't have WA and is asking for his final grades; I told him I don't give that information. 8/5/20: He has not responded to class invite for Fa I 20; today sent bilingual notifications for fall semester; going ahead &WD status & change session tag to N. 12/24/20: Did not respond to 11/14/20 CS. 9/4/21: His brother Basel sent me a new # and asked if Bahaa could re-register for classes.  I don't see this as working out, but I will give him another shot since I have room.  Changing his tag back to Y at this point but I will wait to reactivate his status until he actually shows commitment by coming to class....",
    currentLevel: "L1-M",
    epId: 68989,
    gender: "M",
    initialSession: "FA I 19",
    name: {
      arabic: "بهاء حسين محمد الخالدي",
      english: "Bahaa Hussein Mohammed Al Khalidi",
    },
    nationality: Nationality.JRD,
    phone: {
      hasWhatsapp: true,
      phoneNumbers: [{ number: 777642766 }, { notes: "new WA # as of 9/4/21", number: 775311956 }],
      primaryPhone: 1,
      waBroadcastSAR: "Y SAR Group 3",
    },
    placement: {
      placementData: {
        level: "PL1",
        speaking: "PL1",
        writing: "PL1",
      },
    },
    status: {
      currentStatus: Status.RET,
      inviteTag: true,
      noCallList: false,
      sectionsOffered: ["L1M-B Fa I 21"],
    },
    work: {
      occupation: "High School Student",
    },
  },
  {
    academicRecords: [],
    correspondence:
      "11/9/18: she said that her kids go at 2:00 (or does she mean 'come' from school?  Because she wrote 'go' in Arabic.  Hmm) she is not able to come until after that.  Also when her kids have exams (they are ages 11 & 13) she will not come to English classes.  FYI she lost 4 babies due to liver and heart disease, all before age 8 - three of them were still infants.  These are the only remaining 2 kids.  11/19/18: she can come to the church class on Thursdays only. // 11/26/18: she WA'd in Arabic requesting to audit Level 2 not Level 3 (she was in Level 3 once last week, Wk 1 Fa II 18); I said yes. 8/6/20: I don't know what happened but somehow Sahar got missed on the class schedule distribution in the last couple weeks.  I went ahead & sent her the CS for L3 along w/ notifications for fall semester & there's currently no room in L3; I will wait to hear from her before putting her on CSWL L3, etc. 12/19/20: did not respond to CS 11/17/20; changing tag to N.",
    currentLevel: "L3",
    epId: 19483,
    gender: "F",
    initialSession: "FA I 18",
    name: {
      arabic: "سحر موسى النور سهاونه",
      english: "Sahar Mousa Sahawneh",
    },
    nationality: Nationality.JRD,
    phone: {
      hasWhatsapp: true,
      phoneNumbers: [{ number: 772349662 }],
      primaryPhone: 0,
      waBroadcastSAR: "Y SAR Group 2",
    },
    placement: {
      placementData: {
        level: "L2",
        speaking: "L2+",
        writing: "L2-",
      },
    },
    status: {
      currentStatus: Status.WD,
      inviteTag: false,
      noCallList: false,
    },
    work: {
      occupation: "Retired",
    },
  },
  {
    academicRecords: [],
    correspondence: "4/28/21: Registered him for German Su 21.",
    currentLevel: "L4",
    epId: 12411,
    gender: "M",
    initialSession: "SP I 21",
    name: {
      arabic: "طلال عطالله سالم المساعيد",
      english: "Talal Atallah Al Masaeid",
    },
    nationality: Nationality.JRD,
    phone: {
      hasWhatsapp: true,
      phoneNumbers: [{ number: 772005195 }],
      primaryPhone: 0,
      waBroadcastSAR: "Y SAR Group 4",
    },
    placement: {
      placementData: {
        level: "L4",
        speaking: "L5-",
        writing: "L4",
      },
    },
    status: {
      currentStatus: Status.RET,
      inviteTag: true,
      noCallList: false,
    },
    work: {
      occupation: "Education officer with NRC in Zaatari camp; chemistry major",
    },
  },
  {
    academicRecords: [],
    correspondence:
      "11/2/20: Struggling literate (PEL). 4/10/21: Yousef was attending the class up the point that Scott went on Zoom (for 5/8 weeks).  I had Yousef once with me at the church, using my phone to Zoom, but I don't think he's capable of doing it or learning how to do it by himself.  Leaving his status active and his tag to Y.",
    currentLevel: "PL1-M",
    epId: 17139,
    gender: "M",
    initialSession: "FA II 20",
    name: {
      arabic: "يوسف محمد خالد جوق",
      english: "Yousef Mohammed Khalid",
    },
    nationality: Nationality.SYR,
    phone: {
      hasWhatsapp: true,
      phoneNumbers: [
        { notes: "Mama's # on WA as of 11/2/20", number: 789247692 },
        {
          notes: "# does not appear to have WA as of 11/2/20",
          number: 785725767,
        },
      ],
      primaryPhone: 0,
      waBroadcastSAR: "Y SAR Group 4",
    },
    placement: {
      placementData: {
        level: "PL1",
        speaking: "PL1",
        writing: "PL1",
      },
    },
    status: {
      currentStatus: Status.RET,
      inviteTag: true,
      noCallList: false,
    },
    work: {
      occupation: "Jr high school student",
    },
  },
];