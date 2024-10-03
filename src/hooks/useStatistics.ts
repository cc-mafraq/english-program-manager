import {
  countBy,
  dropRight,
  filter,
  find,
  findIndex,
  flatten,
  forEach,
  get,
  includes,
  last,
  map,
  omit,
  round,
  set,
  some,
  sum,
} from "lodash";
import { useCallback } from "react";
import {
  AcademicRecord,
  CovidStatus,
  DroppedOutReason,
  FinalResult,
  GenderedLevel,
  Level,
  Nationality,
  Status,
  StatusDetails,
  Student,
  StudentStatus,
  WaitlistOutcome,
  genderedLevels,
  levels,
} from "../interfaces";
import {
  getAllSessionsWithPlacement,
  getCurrentSession,
  getSessionsWithResults,
  getStatusDetails,
  isActive,
} from "../services";
import { useStudentStore, useWaitingListStore } from "./useStores";

interface Statistics {
  activeGenderCounts: { [key in Student["gender"]]: number };
  activeLevelCounts: { [key in Level]: number };
  activeNationalityCounts: { [key in Nationality]: number };
  averageAge: number;
  covidStatusCounts: { [key in CovidStatus]: number };
  droppedOutReasonCounts: { [key in DroppedOutReason]: number };
  fullVaccineNationalityCounts: { [key in Nationality]: number };
  genderCounts: { [key in Student["age"]]: number };
  levelCounts: { [key in Level]: number };
  nationalityCounts: { [key in Nationality]: number };
  placementRegistrationCounts: {
    inviteCounts: { [key in StudentStatus["currentStatus"]]: number };
    registrationCounts: { [key in StudentStatus["currentStatus"]]: number };
    session: Student["initialSession"];
  }[];
  predictedRegistration: {
    [key1 in GenderedLevel]?: { [key2 in StudentStatus["currentStatus"]]: number };
  };
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
  waitingListOutcomeCounts: { [key in WaitlistOutcome | "undefined"]: number };
}

const getLevelCounts = (statistics: Statistics, path: string) => {
  set(
    statistics,
    `${path}.PL1`,
    (get(statistics, `${path}.PL1-M`) || 0) + (get(statistics, `${path}.PL1-W`) || 0),
  );
  set(statistics, `${path}.L1`, (get(statistics, `${path}.L1-M`) || 0) + (get(statistics, `${path}.L1-W`) || 0));
  set(statistics, `${path}.L2`, (get(statistics, `${path}.L2-M`) || 0) + (get(statistics, `${path}.L2-W`) || 0));
  return omit(get(statistics, path), ["PL1-M", "PL1-W", "L1-M", "L1-W", "L2-M", "L2-W", ""]) as {
    [key in Level]: number;
  };
};

export const useStatistics = (): Statistics => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const waitingList = useWaitingListStore((state) => {
    return state.waitingList;
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

  const removeSummerSession = (session: Student["initialSession"]) => {
    return !includes(session, "Su");
  };

  const sessions = filter(getSessionsWithResults(students), removeSummerSession);
  const sessionsWithPlacement = filter(getAllSessionsWithPlacement(students), removeSummerSession);

  const placementRegistrationCounts = dropRight(
    map(sessionsWithPlacement, (session) => {
      const placementSessionStudents = filter(students, (student) => {
        return includes(map(student.placement, "session"), session);
      });

      const studentIsRegistered = (student: Student) => {
        const studentPlacementSession = find(student.placement, (placement) => {
          return placement.session === session;
        });
        return studentPlacementSession?.placement !== undefined && studentPlacementSession.placement.length > 0;
      };

      const previousSession =
        sessions[
          findIndex(sessions, (s) => {
            return s === session;
          }) + 1
        ];
      const newInviteStudents = filter(placementSessionStudents, (psrs) => {
        return psrs.initialSession === session;
      });
      const retInviteStudents = filter(placementSessionStudents, (psrs) => {
        const previousAcademicRecord = find(psrs.academicRecords, (ar) => {
          return ar.session === previousSession;
        });
        return (
          previousAcademicRecord?.overallResult === FinalResult.P ||
          previousAcademicRecord?.overallResult === FinalResult.F
        );
      });
      const wdInviteStudents = filter(placementSessionStudents, (psrs) => {
        const previousAcademicRecord = find(psrs.academicRecords, (ar) => {
          return ar.session === previousSession;
        });
        return (
          (previousAcademicRecord === undefined && psrs.initialSession !== session) ||
          previousAcademicRecord?.overallResult === FinalResult.WD
        );
      });
      return {
        inviteCounts: {
          NEW: newInviteStudents.length,
          RET: retInviteStudents.length,
          WD: wdInviteStudents.length,
        },
        registrationCounts: {
          NEW: filter(newInviteStudents, studentIsRegistered).length,
          RET: filter(retInviteStudents, studentIsRegistered).length,
          WD: filter(wdInviteStudents, studentIsRegistered).length,
        },
        session,
      };
    }),
    1,
  );

  const predictedRegistration: {
    [key1 in GenderedLevel]?: { [key2 in StudentStatus["currentStatus"]]: number };
  } = {};
  forEach(genderedLevels, (level) => {
    const previousLevel = level.includes("PL1")
      ? ""
      : levels[
          findIndex(levels, (l) => {
            return level.includes(l);
          }) - 1
        ];
    const previousGenderedLevel =
      level.includes("PL1") || level === "L4" || level === "L5"
        ? previousLevel
        : level.includes("M")
        ? `${previousLevel}-M`
        : level.includes("W")
        ? `${previousLevel}-W`
        : "L2";
    const activeStudentsInLevel = filter(students, (student) => {
      return student.currentLevel === level && isActive(student) && student.academicRecords.length > 0;
    });
    const activeStudentsInPreviousLevel = level.includes("PL1")
      ? []
      : filter(students, (student) => {
          return student.currentLevel.includes(previousGenderedLevel) && isActive(student);
        });

    const allAcademicRecords = flatten(map(students, "academicRecords"));
    const allLevelAcademicRecords = filter(allAcademicRecords, (ar) => {
      return ar?.level === level && ar.overallResult !== undefined;
    });
    const levelPassFailCounts = countBy(allLevelAcademicRecords, "overallResult");
    const allPreviousLevelAcademicRecords = level.includes("PL1")
      ? []
      : filter(allAcademicRecords, (ar) => {
          return ar?.level?.includes(previousGenderedLevel);
        });
    const previousLevelPassFailCounts = countBy(allPreviousLevelAcademicRecords, "overallResult");

    const currentSession = getCurrentSession(students);
    const newStudentsInLevel = filter(students, (student) => {
      return (
        student.status.currentStatus === Status.NEW &&
        student.academicRecords.length === 0 &&
        student.currentLevel === level
      );
    });
    const wdStudentsInLevelWithInvite = filter(students, (student) => {
      return (
        student.status.currentStatus === Status.WD && student.currentLevel === level && student.status.inviteTag
      );
    });
    const newStudentTestInLevelProb =
      filter(students, (student) => {
        return (
          ((level.includes("PL1") && student.origPlacementData?.level === "PL1") ||
            (!level.includes("PL1") && level.includes(student.origPlacementData?.level))) &&
          ((!level.includes("M") && !level.includes("W")) ||
            (level.includes("M") && student.gender === "M") ||
            (level.includes("W") && student.gender === "F"))
        );
      }).length / students.length;

    const newMalePercentage = 0.3;
    const newStudentTestInLevelProbWithGender = level.includes("M")
      ? newStudentTestInLevelProb * 2 * newMalePercentage
      : level.includes("W")
      ? newStudentTestInLevelProb * 2 * (1 - newMalePercentage)
      : newStudentTestInLevelProb;

    const numWDStudentsInLevelThisSession = filter(allLevelAcademicRecords, (ar) => {
      return ar.session === currentSession && ar.overallResult === FinalResult.WD;
    }).length;
    const currentWDPercentage = numWDStudentsInLevelThisSession / activeStudentsInLevel.length;
    const levelWDPercentage = levelPassFailCounts.WD / allLevelAcademicRecords.length;
    const remainingWDPercentage = Math.max(0, levelWDPercentage - currentWDPercentage);
    const levelFailPercentage = levelPassFailCounts.F / allLevelAcademicRecords.length;
    const levelPassPercentage = levelPassFailCounts.P / allLevelAcademicRecords.length;
    const remainingFailPercentage =
      levelFailPercentage +
      (levelFailPercentage * (levelWDPercentage - remainingWDPercentage)) /
        (levelFailPercentage + levelPassPercentage);
    const remainingPassPercentage =
      levelPassPercentage +
      (levelPassPercentage * (levelWDPercentage - remainingWDPercentage)) /
        (levelFailPercentage + levelPassPercentage);
    console.log(level);
    console.log(remainingPassPercentage);
    console.log(remainingFailPercentage);
    console.log(remainingWDPercentage);

    const numWDStudentsInPreviousLevelThisSession = filter(
      allPreviousLevelAcademicRecords,
      (ar: AcademicRecord) => {
        return ar.session === currentSession && ar.overallResult === FinalResult.WD;
      },
    ).length;
    const currentPreviousLevelWDPercentage =
      activeStudentsInPreviousLevel.length > 0
        ? numWDStudentsInPreviousLevelThisSession / activeStudentsInPreviousLevel.length
        : 0;
    const previousLevelWDPercentage =
      allPreviousLevelAcademicRecords.length > 0
        ? previousLevelPassFailCounts.WD / allPreviousLevelAcademicRecords.length
        : 0;
    const remainingPreviousLevelWDPercentage = Math.max(
      0,
      previousLevelWDPercentage - currentPreviousLevelWDPercentage,
    );
    const previousLevelFailPercentage =
      allPreviousLevelAcademicRecords.length > 0
        ? previousLevelPassFailCounts.F / allPreviousLevelAcademicRecords.length
        : 0;
    const previousLevelPassPercentage =
      allPreviousLevelAcademicRecords.length > 0
        ? previousLevelPassFailCounts.P / allPreviousLevelAcademicRecords.length
        : 0;
    const remainingPreviousLevelPassPercentage =
      previousLevelPassPercentage +
      (previousLevelPassPercentage * (previousLevelWDPercentage - remainingPreviousLevelWDPercentage)) /
        (previousLevelFailPercentage + previousLevelPassPercentage);

    const retInvites = sum(map(placementRegistrationCounts, "inviteCounts.RET"));
    const retRegistrations = sum(map(placementRegistrationCounts, "registrationCounts.RET"));
    const newInvites = sum(map(placementRegistrationCounts, "inviteCounts.NEW"));
    const newRegistrations = sum(map(placementRegistrationCounts, "registrationCounts.NEW"));
    const wdInvites = sum(map(placementRegistrationCounts, "inviteCounts.WD"));
    const wdRegistrations = sum(map(placementRegistrationCounts, "registrationCounts.WD"));

    const levelAcademicRecordsArePending = some(
      filter(flatten(map(activeStudentsInLevel, "academicRecords")), (ar: AcademicRecord) => {
        return ar.level === level;
      }),
      (ar: AcademicRecord) => {
        return ar.overallResult === undefined;
      },
    );
    console.log(level);
    console.log(activeStudentsInLevel.length);

    predictedRegistration[level] = {
      // NEW: (number of new students currently waiting to enter level +
      // remaining number of desired new students * the probability that they test into the level) * the registration rate for NEW students
      NEW: round(
        // TODO: Remove hard coded 70 desired students and newMalePercentage, allow for input
        (newStudentsInLevel.length + (70 - newStudentsInLevel.length) * newStudentTestInLevelProbWithGender) *
          (newRegistrations / newInvites),
      ),
      // RET: (number of active students in the level * the probability that they fail +
      // number of active students in previous level * the probability that they pass) * the registration rate for RET students
      RET: round(
        (activeStudentsInLevel.length * (levelAcademicRecordsArePending ? remainingFailPercentage : 1) +
          (level.includes("PL1")
            ? 0
            : activeStudentsInPreviousLevel.length *
              (levelAcademicRecordsArePending ? remainingPreviousLevelPassPercentage : 0))) *
          (retRegistrations / retInvites),
      ),
      // WD: (number of active students in the level * the probability that they withdraw +
      // number of WD students in the level with open invite tag) * the registration rate for WD students
      WD: round(
        (activeStudentsInLevel.length * remainingWDPercentage + wdStudentsInLevelWithInvite.length) *
          (wdRegistrations / wdInvites),
      ),
    };
  });

  const statistics: Statistics = {
    activeGenderCounts: countBy(filterIsActive(), "gender") as { [key in Student["gender"]]: number },
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
    placementRegistrationCounts,
    predictedRegistration,
    sessionCounts: omit(countBy(students, "initialSession"), "") as {
      [key in Student["initialSession"]]: number;
    },
    statusCounts: countBy(students, "status.currentStatus") as { [key in Status]: number },
    statusDetailsCounts: countBy(
      map(students, (student) => {
        return getStatusDetails({ sessions, student, students })[0];
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
    waitingListOutcomeCounts: countBy(waitingList, "outcome") as {
      [key in WaitlistOutcome | "undefined"]: number;
    },
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
    if (last(student.placement)?.pending) statistics.totalPending += 1;
    if (student.work.isTeacher) statistics.totalTeachers += 1;
  });
  statistics.averageAge /= numStudentsWithAge;

  statistics.totalRegistered = students.length;
  statistics.activeLevelCounts = getLevelCounts(statistics, "activeLevelCounts");
  statistics.levelCounts = getLevelCounts(statistics, "levelCounts");
  return statistics;
};
