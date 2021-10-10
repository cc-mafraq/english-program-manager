export interface Student {
  epId: number;
  name: StudentName;
  phone: WhatsappInfo;
  nationality: Nationality;
  currentLevel: GenderedLevel;
  status: StudentStatus;
  correspondence: string;
  gender: 'M' | 'F';
  age?: number;
  placement: Placement;
  classList?: ClassList;
  work: StudentWork;
  initialSession: string;
  literacy?: Literacy;
  zoom?: string;
  academicRecords: AcademicRecord[];
  certificateRequests?: string;
  droppedOutTiming?: DroppedOutTiming;
  droppedOutReason?: DroppedOutReason;
}

export interface AcademicRecord {
  session: string;
  level: Level;
  electiveClass?: string;
  result: FinalResult;
  finalGrade?: string;
  exitWritingExam?: string;
  exitSpeakingExam?: string;
  attendance?: string;
  comments?: string;
  certificate?: boolean;
}

export interface Placement {
  photoContact?: boolean;
  photoContactDate?: string;
  placement?: string;
  notified?: boolean;
  confDate?: string;
  pending?: boolean;
  placementData: {
    writing: LevelPlus;
    speaking: LevelPlus;
    level: Level;
  };
}

export interface StudentWork {
  occupation: string;
  lookingForJob?: string;
  teacher?: boolean;
  teachingSubjectAreas?: string;
  englishTeacherLocation?: string;
}

export interface Literacy {
  illiterateAr?: boolean;
  illiterateEng: boolean;
  tutor?: string;
  tutorDate?: string;
}

export interface WhatsappInfo {
  primaryPhone: number; //index of phoneNumbers
  phoneNumbers: string[];
  hasWhatsapp: boolean;
  whatsappNotes?: string;
  waBroadcastSAR: string;
  otherWaBroadcastGroups?: string[];
}

export interface StudentStatus {
  currentStatus: Status;
  inviteTag: boolean;
  noCallList: boolean;
  reactivatedDate?: string;
  withdrawDate?: string;
  sectionsOffered?: string[];
}

export interface ClassList {
  classListSent?: string;
  classListSentNotes?: string;
  classListSentDate?: string;
}

export interface StudentName {
  english: string;
  arabic: string;
}

export type Level = 'PL1' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L5 GRAD';

export type GenderedLevel =
  | Level
  | ('PL1-M' | 'PL1-W' | 'L1-M' | 'L1-W' | 'L2-M' | 'L2-W');

export type LevelPlus =
  | Level
  | (
      | 'PL1+'
      | 'L1-'
      | 'L1+'
      | 'L2-'
      | 'L2+'
      | 'L3-'
      | 'L3+'
      | 'L4-'
      | 'L4+'
      | 'L5-'
    );

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
  WD1 = 'WD 1st ses or never returned after PE',
  DO1 = 'Dropped out after 1 ses',
  DO2 = 'Dropped out after 2 ses',
  DO3 = 'Dropped out after 3 or more ses',
  SE = 'Attended Previous Session(s) & Still Enrolled',
  SKIP = 'Attended a Session, Skipped a Session, & Returned',
  SES1 = 'Still in 1st Session',
}

export enum DroppedOutReason {
  LCC = 'Lack of Child-Care',
  LT = 'Lack of Transport',
  TC = 'Time Conflict',
  IP = 'Illness or Pregnancy',
  VP = 'Vision Problems',
  JOB = 'Got a Job',
  MOVE = 'Moved',
  GRAD = 'Graduated from L5',
  FTCLE = 'Failed to Thrive in Clsrm Env',
  LLMS = 'Lack of Life Mgm Skills',
  LFS = 'Lack of Familial Support',
  LCM = 'Lack of Commitment or Motivation',
  FMEF = 'Family Member or Employer Forbid Further Study',
  COVID = 'COVID-19 Pandemic Related',
  UNK = 'Unknown',
}

export const SAMPLE_STUDENTS: Student[] = [
  {
    name: {
      english: 'Bahaa Hussein Mohammed Al Khalidi',
      arabic: 'بهاء حسين محمد الخالدي',
    },
    epId: 68989,
    phone: {
      primaryPhone: 1,
      phoneNumbers: ['0777642766', '0775311956 (new WA # as of 9/4/21)'],
      hasWhatsapp: true,
      waBroadcastSAR: 'Y SAR Group 3',
    },
    nationality: Nationality.JRD,
    gender: 'M',
    age: 19,
    currentLevel: 'L1-M',
    status: {
      currentStatus: Status.RET,
      inviteTag: true,
      noCallList: false,
    },
    correspondence:
      "11/13/19: his friend Mohammed Khalid (PL1-M Fa I 19) says Bahaa doesn't have WA and is asking for his final grades; I told him I don't give that information. 8/5/20: He has not responded to class invite for Fa I 20; today sent bilingual notifications for fall semester; going ahead &WD status & change session tag to N. 12/24/20: Did not respond to 11/14/20 CS. 9/4/21: His brother Basel sent me a new # and asked if Bahaa could re-register for classes.  I don't see this as working out, but I will give him another shot since I have room.  Changing his tag back to Y at this point but I will wait to reactivate his status until he actually shows commitment by coming to class....",
    placement: {
      placementData: {
        writing: 'PL1',
        speaking: 'PL1',
        level: 'PL1',
      },
    },
    work: {
      occupation: 'High School Student',
    },
    initialSession: 'FA I 19',
    academicRecords: [],
  },
  {
    name: {
      english: 'Sahar Mousa Sahawneh',
      arabic: 'سحر موسى النور سهاونه',
    },
    epId: 19483,
    phone: {
      primaryPhone: 0,
      phoneNumbers: ['7 7234 9662'],
      hasWhatsapp: true,
      waBroadcastSAR: 'Y SAR Group 2',
    },
    nationality: Nationality.JRD,
    gender: 'F',
    currentLevel: 'L3',
    status: {
      currentStatus: Status.WD,
      inviteTag: false,
      noCallList: false,
    },
    correspondence:
      "11/9/18: she said that her kids go at 2:00 (or does she mean 'come' from school?  Because she wrote 'go' in Arabic.  Hmm) she is not able to come until after that.  Also when her kids have exams (they are ages 11 & 13) she will not come to English classes.  FYI she lost 4 babies due to liver and heart disease, all before age 8 - three of them were still infants.  These are the only remaining 2 kids.  11/19/18: she can come to the church class on Thursdays only. // 11/26/18: she WA'd in Arabic requesting to audit Level 2 not Level 3 (she was in Level 3 once last week, Wk 1 Fa II 18); I said yes. 8/6/20: I don't know what happened but somehow Sahar got missed on the class schedule distribution in the last couple weeks.  I went ahead & sent her the CS for L3 along w/ notifications for fall semester & there's currently no room in L3; I will wait to hear from her before putting her on CSWL L3, etc. 12/19/20: did not respond to CS 11/17/20; changing tag to N.",
    placement: {
      placementData: {
        writing: 'L2-',
        speaking: 'L2+',
        level: 'L2',
      },
    },
    work: {
      occupation: 'Retired',
    },
    initialSession: 'FA I 18',
    academicRecords: [],
  },
  {
    name: {
      english: 'Talal Atallah Al Masaeid',
      arabic: 'طلال عطالله سالم المساعيد',
    },
    epId: 12411,
    phone: {
      primaryPhone: 0,
      phoneNumbers: ['772005195'],
      hasWhatsapp: true,
      waBroadcastSAR: 'Y SAR Group 4',
    },
    nationality: Nationality.JRD,
    gender: 'M',
    currentLevel: 'L4',
    status: {
      currentStatus: Status.RET,
      inviteTag: true,
      noCallList: false,
    },
    correspondence: '4/28/21: Registered him for German Su 21.',
    placement: {
      placementData: {
        writing: 'L4',
        speaking: 'L5-',
        level: 'L4',
      },
    },
    work: {
      occupation: 'Education officer with NRC in Zaatari camp; chemistry major',
    },
    initialSession: 'SP I 21',
    academicRecords: [],
  },
  {
    name: {
      english: 'Yousef Mohammed Khalid',
      arabic: 'يوسف محمد خالد جوق',
    },
    epId: 17139,
    phone: {
      primaryPhone: 0,
      phoneNumbers: [
        "0789247692 (Mama's # on WA as of 11/2/20)",
        '0785725767 (# does not appear to have WA as of 11/2/20)',
      ],
      hasWhatsapp: true,
      waBroadcastSAR: 'Y SAR Group 4',
    },
    nationality: Nationality.SYR,
    gender: 'M',
    currentLevel: 'PL1-M',
    status: {
      currentStatus: Status.RET,
      inviteTag: true,
      noCallList: false,
    },
    correspondence:
      "11/2/20: Struggling literate (PEL). 4/10/21: Yousef was attending the class up the point that Scott went on Zoom (for 5/8 weeks).  I had Yousef once with me at the church, using my phone to Zoom, but I don't think he's capable of doing it or learning how to do it by himself.  Leaving his status active and his tag to Y.",
    placement: {
      placementData: {
        writing: 'PL1',
        speaking: 'PL1',
        level: 'PL1',
      },
    },
    work: {
      occupation: 'Jr high school student',
    },
    initialSession: 'FA II 20',
    academicRecords: [],
  },
];
