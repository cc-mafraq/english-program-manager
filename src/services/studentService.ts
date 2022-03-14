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
} from "lodash";
import { FinalResult, GenderedLevel, Status, Student } from "../interfaces";

export type StudentProgress = {
  [key in GenderedLevel]?: SessionResult[];
};

export interface SessionResult {
  result?: FinalResult;
  session?: string;
}

export const defaultBackgroundColor = "rgba(0,0,0,.06)";
export const defaultBorderColor = "rgba(0,0,0,.5)";
export const RED = "rgba(255,175,175,1)";
export const GREEN = "rgba(198,224,180,1)";
export const YELLOW = "rgba(245,255,150,1)";

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
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  const progress: StudentProgress = { PL1: [], L1: [], L2: [], L3: [], L4: [], L5: [] };
  forEach(student.academicRecords, (ar) => {
    let level: GenderedLevel;
    if (!ar.level) return;
    switch (ar.level) {
      case "PL1-M":
      case "PL1-W":
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
        level = ar.level;
    }
    progress[level]?.push({ result: ar.finalResult?.result, session: ar.session });
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

export const sortStudents = (students: Student[]) => {
  return sortBy(students, (student) => {
    return student.name.english;
  });
};
