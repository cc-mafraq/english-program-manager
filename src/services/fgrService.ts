import { concat, forEach, includes, indexOf, lowerCase, map, replace } from "lodash";
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

export const getLevelForNextSession = (
  student: Student,
  academicRecord: AcademicRecord,
  noIncrement?: boolean,
): string => {
  if (academicRecord.level && includes(levels, replace(academicRecord.level, /(-W)|(-M)/, ""))) {
    const recordLevel = replace(academicRecord.level, /(-W)|(-M)/, "");
    const levelIndex = indexOf(levels, recordLevel);
    if (academicRecord.finalResult?.result === 0 && !noIncrement) {
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
