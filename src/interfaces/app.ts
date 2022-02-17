import { createContext, Dispatch } from "react";
import { Student } from ".";

export interface DataVisibility {
  academicRecords: {
    attendance: boolean;
    certificate: boolean;
    certificateRequests: boolean;
    electiveClass: boolean;
    exitSpeakingExam: boolean;
    exitWritingExam: boolean;
    finalGrade: boolean;
    level: boolean;
    levelAudited: boolean;
    progress: boolean;
    result: boolean;
    session: boolean;
    teacherComments: boolean;
  };
  classList: {
    notes: boolean;
    sent: boolean;
    sentDate: boolean;
  };
  literacy: {
    arabicLiteracy: boolean;
    englishLiteracy: boolean;
    tutorAndDate: boolean;
  };
  phoneNumbersAndWhatsApp: {
    phoneNumbers: boolean;
    waBroadcastOtherGroups: boolean;
    waBroadcastSar: boolean;
    waNotes: boolean;
  };
  placement: {
    naClassSchedule: boolean;
    notified: boolean;
    originalPlacementData: boolean;
    pending: boolean;
    photoContact: boolean;
    placement: boolean;
    placementConfirmed: boolean;
  };
  programInformation: {
    active: boolean;
    correspondence: boolean;
    currentLevel: boolean;
    idNumber: boolean;
    initialSession: boolean;
    inviteTag: boolean;
    noContactList: boolean;
    status: boolean;
  };
  status: {
    audit: boolean;
    finalGrSent: boolean;
    levelRevealDate: boolean;
    reactivatedDate: boolean;
    repeatNumber: boolean;
    sectionsOffered: boolean;
    withdrawDate: boolean;
    withdrawReason: boolean;
  };
  studentInformation: {
    age: boolean;
    englishTeacher: boolean;
    englishTeacherLocation: boolean;
    gender: boolean;
    lookingForJob: boolean;
    nationality: boolean;
    occupation: boolean;
    teacher: boolean;
    teachingSubjectArea: boolean;
  };
  zoom: {
    tutorAndDetails: boolean;
  };
}

export interface AppState {
  dataVisibility: DataVisibility;
  students: Student[];
}

export interface AppAction {
  payload: Partial<AppState>;
  type: "setDataVisibility"; // add | to add more actions in the future
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const voidFn = () => {};

export const initialAppState: AppState = {
  dataVisibility: {
    academicRecords: {
      attendance: true,
      certificate: true,
      certificateRequests: true,
      electiveClass: true,
      exitSpeakingExam: true,
      exitWritingExam: true,
      finalGrade: true,
      level: true,
      levelAudited: true,
      progress: true,
      result: true,
      session: true,
      teacherComments: true,
    },
    classList: {
      notes: true,
      sent: true,
      sentDate: true,
    },

    literacy: {
      arabicLiteracy: true,
      englishLiteracy: true,
      tutorAndDate: true,
    },
    phoneNumbersAndWhatsApp: {
      phoneNumbers: true,
      waBroadcastOtherGroups: true,
      waBroadcastSar: true,
      waNotes: true,
    },
    placement: {
      naClassSchedule: true,
      notified: true,
      originalPlacementData: true,
      pending: true,
      photoContact: true,
      placement: true,
      placementConfirmed: true,
    },
    programInformation: {
      active: true,
      correspondence: true,
      currentLevel: true,
      idNumber: true,
      initialSession: true,
      inviteTag: true,
      noContactList: true,
      status: true,
    },
    status: {
      audit: true,
      finalGrSent: true,
      levelRevealDate: true,
      reactivatedDate: true,
      repeatNumber: true,
      sectionsOffered: true,
      withdrawDate: true,
      withdrawReason: true,
    },
    studentInformation: {
      age: true,
      englishTeacher: true,
      englishTeacherLocation: true,
      gender: true,
      lookingForJob: true,
      nationality: true,
      occupation: true,
      teacher: true,
      teachingSubjectArea: true,
    },
    zoom: {
      tutorAndDetails: true,
    },
  },
  students: [],
};

export interface AppContext {
  appDispatch: Dispatch<AppAction> | (() => void);
  appState: AppState;
}

export const AppContext = createContext<AppContext>({
  appDispatch: voidFn,
  appState: initialAppState,
});
AppContext.displayName = "AppContext";
