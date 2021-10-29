import { countBy, forEach, includes, indexOf, last, map, replace, slice, zip } from "lodash";
import { AcademicRecord, FinalResult, GenderedLevel, Status, Student } from "../interfaces";

export type StudentProgress = {
  [key in GenderedLevel]?: SessionResult[];
};

export interface SessionResult {
  result?: FinalResult;
  session?: string;
}

export const getRepeatNum = (student: Student): string | undefined => {
  const levelsTaken = map(student.academicRecords, "level");
  const levelCounts = countBy(levelsTaken);
  const lastResult = last(student.academicRecords)?.finalResult?.result;
  const repeatNum = levelCounts[student.currentLevel] - 1; // - 1 to not include initial session (not repeated)
  return lastResult === FinalResult.P || !repeatNum ? undefined : `${repeatNum}x`;
};

export const isActive = (student: Student): boolean => {
  return student.status.currentStatus === Status.NEW || student.status.currentStatus === Status.RET;
};

export const getProgress = (student: Student): StudentProgress => {
  const sessions = map(student.academicRecords, "session");
  const levels = map(student.academicRecords, "level");
  const results = map(student.academicRecords, "finalResult.result");
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  const progress: StudentProgress = { PL1: [], L1: [], L2: [], L3: [], L4: [], L5: [] };
  forEach(zip(sessions, levels, results), ([s, l, r]) => {
    let level: GenderedLevel = "PL1";
    switch (l) {
      case "PL1-M":
      case "PL1-W":
      case undefined:
        level = "PL1";
        break;
      case "L1-M":
      case "L1-W":
        level = "L1";
        break;
      case "L2-M":
      case "L2-W":
        level = "L2";
        break;
      default:
        level = l;
    }
    progress[level]?.push({ result: r, session: s });
  });
  return progress;
};

export const getStudentPage = (
  students: Student[],
  page: number,
  rowsPerPage: number,
): Student[] => {
  const newRowsPerPage = rowsPerPage > students.length ? students.length : rowsPerPage;
  return slice(students, page * newRowsPerPage, (page + 1) * newRowsPerPage);
};

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
  const levels = ["PL1", "L1", "L2", "L3", "L4", "L5", "L5 GRAD"];
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
