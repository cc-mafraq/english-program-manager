export interface Student {
  id: string;
  nameEng: string;
  nameAr: string;
  photoId?: string;
  IdCardId?: string;
  epId: number;
  primaryPhone: number; //index of phoneNumbers
  phoneNumbers: string[];
  nationality: string;
  inviteTag: boolean;
  noCallList: boolean;
  currentLevel: GenderedLevel;
  repeatNumber?: number; // Maybe remove?
  audit?: boolean; // Maybe remove?
  fgrDate?: string; // What does this mean?
  sectionsOffered?: string[];
  reactivatedDate?: string;
  withdrawDate?: string;
  currentStatus: Status;
  placement?: {
    photoContact?: boolean;
    photoContactDate?: string;
    placement?: string;
    notified?: boolean;
    confDate?: string;
    pending?: boolean;
  };
  correspondence?: string;
  classListSent?: string;
  classListSentDate?: string;
  gender: 'M' | 'F';
  age?: number;
  work: {
    occupation: string;
    lookingForJob?: string;
    teacher?: boolean;
    teachingSubjectAreas?: string;
    englishTeacherLocation?: string;
  };
  hasWhatsapp: boolean;
  waBroadcastSAR: string;
  otherWaBroadcastGroups?: string[];
  sessionEntered: string;
  literacy?: {
    illiterateAr?: boolean;
    illiterateEng: boolean;
    tutor?: string;
    tutorDate?: string;
  };
  zoom?: string;
  academicRecords: AcademicRecord[];
  finalGradeReportIds?: string[];
  certificateRequests?: string;
  placementData: {
    writing: LevelPlus;
    speaking: LevelPlus;
    level: Level;
  };
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
  comments: string;
  certificate: boolean;
}

export type Level = 'PL1' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L5 GRAD';

export type GenderedLevel = Level &
  ('PL1-M' | 'PL1-W' | 'L1-M' | 'L1-W' | 'L2-M' | 'L2-W');

export type LevelPlus = Level &
  (
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
