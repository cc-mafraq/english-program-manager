import {
  countBy,
  filter,
  forEach,
  includes,
  isEmpty,
  last,
  lowerCase,
  map,
  nth,
  replace,
  reverse,
  slice,
  sortBy,
  uniq,
  zip,
} from "lodash";
import { FinalResult, GenderedLevel, Status, Student } from "../interfaces";

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

export const filterBySession = (
  students: Student[],
  session: Student["initialSession"],
): Student[] => {
  return filter(students, (s) => {
    return includes(map(s.academicRecords, "session"), session);
  });
};

export const filterOutById = (students: Student[], id: Student["epId"]): Student[] => {
  return filter(students, (s) => {
    return s.epId !== id;
  });
};

export const getAllSessions = (students: Student[]) => {
  return filter(
    reverse(
      sortBy(uniq(map(students, "initialSession")), (session) => {
        const sessionParts = session.split(" ");
        return `${nth(sessionParts, 2)} ${replace(
          replace(lowerCase(nth(sessionParts, 0)), "fa", "2"),
          "sp",
          "1",
        )} ${nth(sessionParts, 1)}`;
      }),
    ),
    (s) => {
      return !isEmpty(s);
    },
  );
};

export const generateId = (students: Student[]): number => {
  const randomId = Math.floor(Math.random() * 90000 + 10000);
  const studentIds = map(students, "epId");
  if (includes(studentIds, randomId)) {
    return generateId(students);
  }
  return randomId;
};
