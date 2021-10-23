import { countBy, forEach, last, map, zip } from "lodash";
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
