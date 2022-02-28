import {
  concat,
  filter,
  forEach,
  includes,
  indexOf,
  isEqual,
  lowerCase,
  map,
  nth,
  replace,
  some,
  split,
} from "lodash";
import { AcademicRecord, FinalResult, Student } from "../interfaces";

export interface StudentAcademicRecordIndex {
  academicRecordIndex: number;
  student: Student;
}

const levels = ["PL1", "L1", "L2", "L3", "L4", "L5", "L5 GRAD"];

export const getFullLevelName = (level: string): string => {
  return replace(
    replace(replace(replace(level, "P", "Pre-"), "L", "Level "), /(-W)|(-M)/, ""),
    "GRAD",
    "Graduate",
  );
};

export const getLevelForNextSession = ({
  academicRecord,
  isOtherRecord,
  student,
  noIncrement,
}: {
  academicRecord: AcademicRecord;
  isOtherRecord?: boolean;
  noIncrement?: boolean;
  student: Student;
}): string => {
  if (academicRecord.level) {
    const recordLevel = replace(academicRecord.level, /(-W)|(-M)/, "");
    const isCoreClass = includes(levels, recordLevel);
    const levelIndex = isCoreClass
      ? indexOf(levels, recordLevel)
      : indexOf(levels, replace(student.currentLevel, /(-W)|(-M)/, ""));
    const hasPassed = academicRecord.finalResult?.result === "P";
    const sessionAcademicRecords = filter(student.academicRecords, (ar) => {
      return (
        !isOtherRecord &&
        !noIncrement &&
        ar.session === academicRecord.session &&
        !isEqual(ar, academicRecord)
      );
    });
    const sessionAcademicRecordNextLevels = map(sessionAcademicRecords, (sessionAR) => {
      return getLevelForNextSession({ academicRecord: sessionAR, isOtherRecord: true, student });
    });
    const passedDifferentCoreClass =
      !isCoreClass &&
      some(sessionAcademicRecordNextLevels, (sessionARNL) => {
        return sessionARNL !== recordLevel;
      });
    if (
      !noIncrement &&
      ((isCoreClass && hasPassed) || (!isCoreClass && passedDifferentCoreClass))
    ) {
      return getFullLevelName(levels[levelIndex + 1]);
    }
    return getFullLevelName(levels[levelIndex]);
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
        ar.finalResult?.result !== FinalResult.WD &&
        !(ar.finalResult?.result === undefined && ar.attendance === undefined) &&
        !ar.levelAudited
      ) {
        fgrStudents.push({ academicRecordIndex: i, student });
      }
    });
  });
  return fgrStudents;
};

export const isElective = (academicRecord: AcademicRecord): boolean => {
  const genderedLevels = concat(levels, ["PL1-M", "PL1-W", "L1-M", "L1-W", "L2-M", "L2-W"]);
  return !includes(genderedLevels, academicRecord.level);
};

export const getElectiveFullName = (electiveName: string): string => {
  return replace(
    replace(electiveName, "I&T", "IELTS & TOEFL"),
    /(Ac Rdg)|(Adv Rdg)/,
    "Advanced Reading",
  );
};

export const getSessionFullName = (session: string): string => {
  return replace(
    replace(
      replace(replace(lowerCase(session), /i/g, "I"), /(\d{2})/, (r) => {
        return `20${r}`;
      }),
      "sp",
      "Spring",
    ),
    "fa",
    "Fall",
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
  return secondName === "Al" ? `${shortName} ${thirdName}` : shortName;
};
