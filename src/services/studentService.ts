import { countBy, map } from "lodash";
import { Student } from "../interfaces";

export const computeRepeatX = (student: Student): string => {
  const levelsTaken = map(student.academicRecords, "level");
  const levelCounts = countBy(levelsTaken);
  return `${levelCounts[student.currentLevel] - 1}x`;
};
