import {
  countBy,
  filter,
  find,
  first,
  flatten,
  forEach,
  includes,
  isEmpty,
  isUndefined,
  keyBy,
  last,
  lowerCase,
  map,
  mapValues,
  nth,
  replace,
  reverse,
  set,
  slice,
  some,
  sortBy,
  sum,
  uniq,
} from "lodash";
import { FinalResult, GenderedLevel, Level, levels, Status, StatusDetails, Student } from "../interfaces";
import { getLevelAtSession } from "./fgrService";

export const JOIN_STR = ", ";

export type StudentProgress = {
  [key in Level]?: SessionResult[];
};

export interface SessionResult {
  isAudit?: boolean;
  level?: string;
  result?: FinalResult;
  session?: string;
}

export interface FilterField<T> {
  condition?: boolean;
  fn?: (data: T) => unknown;
  ignoreValueMappings?: boolean;
  name: string;
  path: string;
  values?: unknown[];
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

export const getProgress = (student: Student, sessionOptions: string[]): StudentProgress => {
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  const progress: StudentProgress = { PL1: [], L1: [], L2: [], L3: [], L4: [], L5: [] };
  forEach(student.academicRecords, (ar) => {
    let level: GenderedLevel;
    if (!ar.level && !ar.levelAudited) return;
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
        level = (ar.levelAudited as Level) || ar.level;
    }
    if (!level) return;
    const isCoreClass = includes(levels, level);
    const electiveOrAuditLevel = first(
      filter(levels, (l) => {
        return (
          (level.includes(l) && !level.includes(`${l}-`)) || (ar.level?.includes(l) && !ar.level.includes(`${l}-`))
        );
      }) as Level[],
    );
    progress[
      isCoreClass || electiveOrAuditLevel
        ? electiveOrAuditLevel || level
        : getLevelAtSession(ar.session, student, sessionOptions, true)
    ]?.push({
      isAudit: !isUndefined(ar.levelAudited) && isUndefined(ar.level),
      level: isCoreClass ? undefined : level,
      result:
        isCoreClass ||
        (!isCoreClass &&
          (ar.finalResult?.result === "F" || ar.finalResult?.result === "WD" || !ar.finalResult?.percentage))
          ? ar.finalResult?.result
          : FinalResult.P,
      session: ar.session,
    });
  });
  return progress;
};

export const getPage = <T>(list: T[], page: number, rowsPerPage: number): T[] => {
  const newRowsPerPage = rowsPerPage > list.length || rowsPerPage < 0 ? list.length : rowsPerPage;
  return slice(list, page * newRowsPerPage, (page + 1) * newRowsPerPage);
};

export const filterBySession = (students: Student[], session: Student["initialSession"]): Student[] => {
  return filter(students, (s) => {
    return includes(map(s.academicRecords, "session"), session);
  });
};

export const filterOutById = (students: Student[], id: Student["epId"]): Student[] => {
  return filter(students, (s) => {
    return s.epId !== id;
  });
};

export const sortBySession = (session: Student["initialSession"]) => {
  const sessionParts = session.split(" ");
  return `${nth(sessionParts, 2)} ${replace(replace(lowerCase(nth(sessionParts, 0)), "fa", "2"), "sp", "1")} ${nth(
    sessionParts,
    1,
  )}`;
};

export const getAllSessions = (students: Student[]) => {
  return filter(reverse(sortBy(uniq(map(students, "initialSession")), sortBySession)), (s) => {
    return !isEmpty(s);
  });
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

export const getStudentOptions = (students: Student[]): string[] => {
  return map(students, (student) => {
    return `${student.epId} - ${student.name.english}`;
  });
};

export const getStudentById = (id: Student["epId"], students: Student[]): Student | undefined => {
  return find(students, { epId: id });
};

export const getSessionsWithResults = (students: Student[]) => {
  const allSessions = getAllSessions(students);
  return filter(allSessions, (session) => {
    return some(
      map(
        filter(flatten(map(students, "academicRecords")), (ar) => {
          return ar.session === session;
        }),
        "finalResult.result",
      ),
    );
  });
};

export const getStatusDetails = ({
  student,
  students,
  sessions,
}: {
  sessions?: Student["initialSession"][];
  student: Student;
  students?: Student[];
}): [StatusDetails, number] => {
  const sessionsWithResults = sessions || (students && getSessionsWithResults(students));
  const sessionsAttended = mapValues(keyBy(sessionsWithResults), () => {
    return false;
  });
  forEach(student.academicRecords, (ar) => {
    if (ar.finalResult?.result !== FinalResult.WD && includes(sessionsWithResults, ar.session)) {
      set(sessionsAttended, ar.session, true);
    }
  });
  const progress = Object.values(sessionsAttended);
  const numSessionsAttended = sum(progress);
  if (
    (numSessionsAttended === 1 && progress[0]) ||
    // Return 1st Session if the student's ar has a session in the future (not inclded in sessionWithResults) and they have no sessions in the past
    (student.academicRecords.length &&
      numSessionsAttended === 0 &&
      !includes(sessionsWithResults, student.academicRecords[0].session))
  )
    return [StatusDetails.SES1, numSessionsAttended];
  if (numSessionsAttended === 1 && !progress[0]) return [StatusDetails.DO1, numSessionsAttended];
  if (numSessionsAttended === 2 && !progress[0]) return [StatusDetails.DO2, numSessionsAttended];
  if (numSessionsAttended > 2 && !progress[0]) return [StatusDetails.DO3, numSessionsAttended];
  if (numSessionsAttended > 1 && progress[0] && progress[1]) return [StatusDetails.SE, numSessionsAttended];
  if (numSessionsAttended === 0) return [StatusDetails.WD1, numSessionsAttended];
  return [StatusDetails.SKIP, numSessionsAttended];
};
