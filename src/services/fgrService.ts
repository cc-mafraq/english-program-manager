import { concat, filter, forEach, includes, indexOf, isEmpty, lowerCase, map, nth, replace, split } from "lodash";
import { AcademicRecord, FinalResult, Level, Student, levels } from "../interfaces";

export interface StudentAcademicRecordIndex {
  academicRecordIndex: number;
  student: Student;
}

export interface FinalGradeReportFormValues {
  attendance: string;
  classGrade: string;
  className?: string;
  exitSpeakingExam: string;
  exitWritingExam: string;
  level: string;
  name: string;
  nextSessionLevel: string;
  passOrRepeat?: "Pass" | "Repeat";
  session: string;
  studentId: string;
}

const levelsWithGrad: Level[] =
  import.meta.env.VITE_PROJECT_NAME === "ccm-english" ? [...levels, "L5 GRAD"] : levels;

export const getFullLevelName = (level?: string): string => {
  if (level === undefined || isEmpty(level)) return "";
  return replace(
    replace(replace(replace(level, "P", "Pre-"), "L", "Level "), /(-W)|(-M)/, ""),
    "GRAD",
    "Graduate",
  );
};

export const getSessionIndex = (session: string, sessionOptions: string[]) => {
  return indexOf(
    map(sessionOptions, (so) => {
      return replace(so, /\s/g, "");
    }),
    replace(session, /\s/g, ""),
  );
};

export const getLevelAtSession = (
  session: AcademicRecord["session"],
  student: Student,
  sessionOptions: Student["initialSession"][],
  noIncrement?: boolean,
): Level | undefined => {
  if (student.currentLevel === undefined) {
    return undefined;
  }
  const sessionIndex = getSessionIndex(session, sessionOptions);
  const academicRecordLevelSessionResults = filter(
    map(student.academicRecords, (ar) => {
      return {
        level: ar.levelAudited || ar.level,
        result: ar.overallResult,
        session: ar.session,
      };
    }),
    (lrs) => {
      const lrsSessionIndex = getSessionIndex(lrs.session, sessionOptions);
      return lrsSessionIndex > sessionIndex || (!noIncrement && lrsSessionIndex === sessionIndex);
    },
  );

  let level = student.origPlacementData?.level;
  forEach(academicRecordLevelSessionResults, (sarlsr) => {
    const sarlsrLevel = replace(sarlsr.level ?? "", /(-W)|(-M)/, "");
    const isCoreClass = includes(levelsWithGrad, sarlsrLevel);
    const levelIndex = indexOf(levelsWithGrad, sarlsrLevel);
    if (isCoreClass && levelIndex >= indexOf(levelsWithGrad, level)) {
      level = sarlsr.result === "P" ? levelsWithGrad[levelIndex + 1] : levelsWithGrad[levelIndex];
    }
  });
  return level || (replace(student.currentLevel, /(-W)|(-M)/, "") as Level);
};

export const getLevelForNextSession = ({
  academicRecord,
  student,
  noIncrement,
  sessionOptions,
}: {
  academicRecord: AcademicRecord;
  noIncrement?: boolean;
  sessionOptions: Student["initialSession"][];
  student: Student;
}): string => {
  if (academicRecord.levelAudited || academicRecord.level) {
    const recordLevel = academicRecord.levelAudited
      ? replace(academicRecord.levelAudited, /(-W)|(-M)/, "")
      : academicRecord.level
      ? replace(academicRecord.level, /(-W)|(-M)/, "")
      : "";

    const isCoreClass = includes(levelsWithGrad, recordLevel);
    const levelIndex = isCoreClass
      ? indexOf(levelsWithGrad, recordLevel)
      : indexOf(levelsWithGrad, getLevelAtSession(academicRecord.session, student, sessionOptions, noIncrement));
    const hasPassed =
      (isCoreClass && academicRecord.overallResult === "P") ||
      (!isCoreClass &&
        academicRecord.exitWritingExam?.result === "P" &&
        academicRecord.exitSpeakingExam?.result === "P");
    if (!noIncrement && hasPassed) {
      return getFullLevelName(levelsWithGrad[levelIndex + 1]);
    }
    return getFullLevelName(levelsWithGrad[levelIndex]);
  }
  return getFullLevelName(student.currentLevel);
};

export const getFGRStudents = (
  students: Student[],
  session: Student["initialSession"],
): StudentAcademicRecordIndex[] => {
  const fgrStudents: StudentAcademicRecordIndex[] = [];
  forEach(students, (student) => {
    forEach(student.academicRecords, (ar, i) => {
      // conditions for creating an FGR
      if (
        lowerCase(ar.session) === lowerCase(session) &&
        ar.overallResult !== FinalResult.WD &&
        !(ar.overallResult === undefined && ar.attendance === undefined) &&
        (ar.level || ar.levelAudited)
      ) {
        fgrStudents.push({ academicRecordIndex: i, student });
      }
    });
  });
  return fgrStudents;
};

export const isElective = (level: AcademicRecord["level"]): boolean => {
  const genderedLevels = concat(levelsWithGrad, ["PL1-M", "PL1-W", "L1-M", "L1-W", "L2-M", "L2-W"]);
  return !includes(genderedLevels, level);
};

export const getElectiveFullName = (electiveName: string): string => {
  return replace(
    replace(
      replace(
        replace(
          replace(
            replace(replace(electiveName, "I&T", "IELTS & TOEFL"), /(Ac Rdg)|(Adv Rdg)|(AR)/, "Advanced Reading "),
            /C(?=[0-9])/,
            "Conversation ",
          ),
          /Conv(?=[0-9])/,
          "Conversation ",
        ),
        "AW",
        "Advanced Writing ",
      ),
      /(?<=IELTS & TOEFL)S/,
      " Speaking",
    ),
    /(?<=IELTS & TOEFL)L/,
    " Listening",
  );
};

export const getSessionFullName = (session: string): string => {
  return replace(
    replace(
      replace(
        replace(replace(lowerCase(session), /i/g, "I"), /(\d{2})/, (r) => {
          return `20${r}`;
        }),
        "sp",
        "Spring",
      ),
      "fa",
      "Fall",
    ),
    "su",
    "Summer",
  );
};

export const getSortedSARIndexArray = (sarArr: StudentAcademicRecordIndex[]) => {
  return map(sarArr, (sar) => {
    return `${sar.student.epId}${sar.academicRecordIndex}`;
  }).sort();
};

export const getStudentShortName = (student: Student) => {
  const nameParts = split(student.name.english, " ");
  const firstName = nth(nameParts, 0);
  const secondName = nth(nameParts, 1);
  const thirdName = nth(nameParts, 2);
  const shortName = `${firstName} ${secondName}`;
  return (secondName === "Al" ||
    secondName === "Abd" ||
    firstName === "Abd" ||
    secondName?.startsWith('"') ||
    secondName === "Abed" ||
    firstName === "Abed") &&
    thirdName !== "Al"
    ? `${shortName} ${thirdName}`
    : shortName;
};
