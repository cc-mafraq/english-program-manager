import { countBy, filter, forEach, get, map, omit, set } from "lodash";
import { useCallback } from "react";
import {
  CovidStatus,
  DroppedOutReason,
  GenderedLevel,
  Level,
  Nationality,
  Status,
  StatusDetails,
  Student,
} from "../interfaces";
import { getSessionsWithResults, getStatusDetails, isActive } from "../services";
import { useStudentStore } from "./useStores";

interface Statistics {
  activeLevelCounts: { [key in Level]: number };
  activeNationalityCounts: { [key in Nationality]: number };
  averageAge: number;
  covidStatusCounts: { [key in CovidStatus]: number };
  droppedOutReasonCounts: { [key in DroppedOutReason]: number };
  fullVaccineNationalityCounts: { [key in Nationality]: number };
  genderCounts: { [key in Student["age"]]: number };
  levelCounts: { [key in Level]: number };
  nationalityCounts: { [key in Nationality]: number };
  sessionCounts: { [key in Student["initialSession"]]: number };
  statusCounts: { [key in Status]: number };
  statusDetailsCounts: { [key in StatusDetails]: number };
  totalActive: number;
  totalEligible: number;
  totalEnglishTeachers: number;
  totalIlliterateArabic: number;
  totalIlliterateEnglish: number;
  totalNCL: number;
  totalPending: number;
  totalRegistered: number;
  totalTeachers: number;
}

const getLevelCounts = (statistics: Statistics, path: string) => {
  set(statistics, `${path}.PL1`, get(statistics, `${path}.PL1-M`) + get(statistics, `${path}.PL1-W`));
  set(statistics, `${path}.L1`, get(statistics, `${path}.L1-M`) + get(statistics, `${path}.L1-W`));
  set(statistics, `${path}.L2`, get(statistics, `${path}.L2-M`) + get(statistics, `${path}.L2-W`));
  return omit(get(statistics, path), ["PL1-M", "PL1-W", "L1-M", "L1-W", "L2-M", "L2-W", ""]) as {
    [key in Level]: number;
  };
};

export const useStatistics = (): Statistics => {
  const students = useStudentStore((state) => {
    return state.students;
  });

  const filterIsActive = useCallback(() => {
    return filter(students, (s) => {
      return isActive(s);
    });
  }, [students]);

  const filterFullVaccine = useCallback(() => {
    return filter(students, (s) => {
      return s.covidVaccine.status === CovidStatus.FULL;
    });
  }, [students]);

  const sessions = getSessionsWithResults(students);

  const statistics: Statistics = {
    activeLevelCounts: countBy(filterIsActive(), "currentLevel") as { [key in GenderedLevel]: number },
    activeNationalityCounts: countBy(filterIsActive(), "nationality") as { [key in Nationality]: number },
    averageAge: 0,
    covidStatusCounts: countBy(students, "covidVaccine.status") as { [key in CovidStatus]: number },
    droppedOutReasonCounts: omit(countBy(students, "status.droppedOutReason"), "undefined") as {
      [key in DroppedOutReason]: number;
    },
    fullVaccineNationalityCounts: countBy(filterFullVaccine(), "nationality") as {
      [key in Nationality]: number;
    },
    genderCounts: countBy(students, "gender") as { [key in Student["age"]]: number },
    levelCounts: countBy(students, "currentLevel") as { [key in GenderedLevel]: number },
    nationalityCounts: countBy(students, "nationality") as { [key in Nationality]: number },
    sessionCounts: omit(countBy(students, "initialSession"), "") as {
      [key in Student["initialSession"]]: number;
    },
    statusCounts: countBy(students, "status.currentStatus") as { [key in Status]: number },
    statusDetailsCounts: countBy(
      map(students, (student) => {
        return getStatusDetails({ sessions, student })[0];
      }),
    ) as { [key in StatusDetails]: number },
    totalActive: 0,
    totalEligible: 0,
    totalEnglishTeachers: 0,
    totalIlliterateArabic: 0,
    totalIlliterateEnglish: 0,
    totalNCL: 0,
    totalPending: 0,
    totalRegistered: 0,
    totalTeachers: 0,
  };

  let numStudentsWithAge = 0;
  forEach(students, (student) => {
    if (student.age) {
      const ageNum = Number(student.age);
      if (!Number.isNaN(ageNum)) {
        statistics.averageAge += ageNum;
        numStudentsWithAge += 1;
      }
    }
    if (isActive(student)) statistics.totalActive += 1;
    if (student.status.inviteTag) statistics.totalEligible += 1;
    if (student.work.isEnglishTeacher) statistics.totalEnglishTeachers += 1;
    if (student.literacy.illiterateAr) statistics.totalIlliterateArabic += 1;
    if (student.literacy.illiterateEng) statistics.totalIlliterateEnglish += 1;
    if (student.status.noContactList) statistics.totalNCL += 1;
    if (student.placement.pending) statistics.totalPending += 1;
    if (student.work.isTeacher) statistics.totalTeachers += 1;
  });
  statistics.averageAge /= numStudentsWithAge;

  statistics.totalRegistered = students.length;
  statistics.activeLevelCounts = getLevelCounts(statistics, "activeLevelCounts");
  statistics.levelCounts = getLevelCounts(statistics, "levelCounts");
  return statistics;
};
