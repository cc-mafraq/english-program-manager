import { includes, indexOf, replace } from "lodash";
import { AcademicRecord, Student } from "../interfaces";

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
