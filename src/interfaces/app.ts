import { PaletteMode, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createContext, Dispatch } from "react";
import { Student } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const voidFn = () => {};

export const defaultBorderColor = "#808080";
export const darkBlueBackground = "#12161F";
export const lightPrimaryColor = "#002060";
export const lightPrimaryDarkColor = "#000B44";

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  const lightSecondaryColor = "#196da7";
  const darkPrimaryColor = "#58a6ff";
  const darkSecondaryColor = "#004d9a";
  const darkBackgroundColor = "#161b22";

  return {
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: lightPrimaryColor,
            },
            secondary: {
              main: lightSecondaryColor,
            },
          }
        : {
            background: {
              default: darkBackgroundColor,
              paper: darkBackgroundColor,
            },
            primary: {
              main: darkPrimaryColor,
            },
            secondary: {
              main: darkSecondaryColor,
            },
            text: {
              primary: grey[300],
              secondary: grey[400],
            },
          }),
    },
  };
};

export interface AppAction {
  payload: Partial<AppState>;
  type: "set";
}

export interface DataVisibility {
  academicRecords: {
    attendance: boolean;
    certificateRequests: boolean;
    exitSpeakingExam: boolean;
    exitWritingExam: boolean;
    finalGrade: boolean;
    level: boolean;
    levelAudited: boolean;
    progress: boolean;
    session: boolean;
    teacherComments: boolean;
  };
  covidVaccine: {
    certificatePhoto: boolean;
    date: boolean;
    reason: boolean;
    status: boolean;
    suspectedFraud: boolean;
    suspectedFraudReason: boolean;
  };
  demographics: {
    age: boolean;
    englishTeacher: boolean;
    englishTeacherLocation: boolean;
    gender: boolean;
    lookingForJob: boolean;
    nationality: boolean;
    occupation: boolean;
    photo: boolean;
    teacher: boolean;
    teachingSubjectArea: boolean;
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
    classScheduleSentDate: boolean;
    naClassScheduleWpm: boolean;
    originalPlacementData: boolean;
    pending: boolean;
    photoContact: boolean;
    placement: boolean;
    sectionsOffered: boolean;
  };
  programInformation: {
    active: boolean;
    currentLevel: boolean;
    familyCoordinatorEntry: boolean;
    idNumber: boolean;
    initialSession: boolean;
    inviteTag: boolean;
    noContactList: boolean;
    status: boolean;
  };
  status: {
    audit: boolean;
    finalGrSent: boolean;
    levelReevalDate: boolean;
    reactivatedDate: boolean;
    repeatNumber: boolean;
    withdrawDate: boolean;
    withdrawReason: boolean;
  };
  zoom: {
    tutorAndDetails: boolean;
  };
}

export interface AppState {
  dataVisibility: DataVisibility;
  loading: boolean;
  selectedStudent: Student | null;
  students: Student[];
}

export const initialAppState: AppState = {
  dataVisibility: {
    academicRecords: {
      attendance: true,
      certificateRequests: true,
      exitSpeakingExam: true,
      exitWritingExam: true,
      finalGrade: true,
      level: true,
      levelAudited: true,
      progress: true,
      session: true,
      teacherComments: true,
    },
    covidVaccine: {
      certificatePhoto: true,
      date: true,
      reason: true,
      status: true,
      suspectedFraud: true,
      suspectedFraudReason: true,
    },
    demographics: {
      age: true,
      englishTeacher: true,
      englishTeacherLocation: true,
      gender: true,
      lookingForJob: true,
      nationality: true,
      occupation: true,
      photo: true,
      teacher: true,
      teachingSubjectArea: true,
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
      classScheduleSentDate: true,
      naClassScheduleWpm: true,
      originalPlacementData: true,
      pending: true,
      photoContact: true,
      placement: true,
      sectionsOffered: true,
    },
    programInformation: {
      active: true,
      currentLevel: true,
      familyCoordinatorEntry: true,
      idNumber: true,
      initialSession: true,
      inviteTag: true,
      noContactList: true,
      status: true,
    },
    status: {
      audit: true,
      finalGrSent: true,
      levelReevalDate: true,
      reactivatedDate: true,
      repeatNumber: true,
      withdrawDate: true,
      withdrawReason: true,
    },
    zoom: {
      tutorAndDetails: true,
    },
  },
  loading: true,
  selectedStudent: null,
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
