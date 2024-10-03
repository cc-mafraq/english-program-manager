import {
  countBy,
  Dictionary,
  dropRight,
  filter,
  find,
  findIndex,
  flatten,
  forEach,
  fromPairs,
  includes,
  isEmpty,
  map,
  round,
  sortBy,
  sum,
  toPairs,
} from "lodash";
import {
  AcademicRecord,
  FinalResult,
  GenderedLevel,
  genderedLevels,
  Level,
  levels,
  Status,
  Student,
  StudentStatus,
} from "../interfaces";
import {
  getAllInitialSessions,
  getAllSessionsWithPlacement,
  getCurrentSession,
  getSessionsWithoutSummer,
  isActive,
  removeSummerSession,
} from "./studentService";

// https://stackoverflow.com/questions/32349838/lodash-sorting-object-by-values-without-losing-the-key
export const sortObjectByValues = (obj: Dictionary<unknown>): Dictionary<unknown> => {
  return fromPairs(sortBy(toPairs(obj), 1));
};

export const getPlacementRegistrationCounts = (students: Student[]) => {
  const sessions = getSessionsWithoutSummer(students);
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
  return placementRegistrationCounts;
};

export const predictPlacements = (
  students: Student[],
  finishedCurrentSession: boolean,
  numNewStudents: number | null,
  percentageMaleStudents: number | null,
  currentWeek: number | null,
  totalWeeks: number | null,
) => {
  const predictedRegistration: {
    [key1 in GenderedLevel]?: { [key2 in StudentStatus["currentStatus"]]: number };
  } = {};

  const historicMalePercentage =
    filter(students, (student) => {
      return student.gender === "M";
    }).length / students.length;

  const numNewStudentsSafe = numNewStudents ?? 0;
  const percentageMaleStudentsSafe = percentageMaleStudents ?? historicMalePercentage;
  const currentWeekSafe = currentWeek ?? 1;
  const totalWeeksSafe = totalWeeks ?? 1;

  const getPreviousLevel = (level: GenderedLevel) => {
    return level.includes("PL1")
      ? ""
      : levels[
          findIndex(levels, (l) => {
            return level.includes(l);
          }) - 1
        ];
  };

  // Add gender to previous level if the current level is gendered (and not PL1)
  const addGenderIfApplicable = (level: GenderedLevel, previousLevel: Level | ""): GenderedLevel | "" => {
    return (level.includes("PL1") || level === "L4" || level === "L5"
      ? previousLevel
      : level.includes("M")
      ? `${previousLevel}-M`
      : level.includes("W")
      ? `${previousLevel}-W`
      : "L2") as unknown as GenderedLevel | "";
  };

  const getActiveStudents = () => {
    return filter(students, (student) => {
      return isActive(student) && student.academicRecords.length > 0;
    });
  };

  const getActiveStudentsInLevel = (level: GenderedLevel | "", include?: boolean) => {
    return isEmpty(level)
      ? []
      : filter(students, (student) => {
          const isInLevel = !!(include ? student?.currentLevel?.includes(level) : student?.currentLevel === level);
          return isInLevel && isActive(student) && student.academicRecords.length > 0;
        });
  };

  const getAcademicRecordsByLevel = (
    academicRecords: AcademicRecord[],
    level: GenderedLevel | "",
    include?: boolean,
  ): AcademicRecord[] => {
    return level === ""
      ? []
      : filter(academicRecords, (ar) => {
          const isInLevel = !!(include ? ar?.level?.includes(level) : ar?.level === level);
          return isInLevel && ar.overallResult !== undefined;
        });
  };

  const getNewStudentsInLevel = (level: GenderedLevel) => {
    return filter(students, (student) => {
      return (
        student.status.currentStatus === Status.NEW &&
        student.academicRecords.length === 0 &&
        student.currentLevel === level
      );
    });
  };

  const getWdStudentsInLevelWithInvite = (level: GenderedLevel) => {
    return filter(students, (student) => {
      return (
        student.status.currentStatus === Status.WD && student.currentLevel === level && student.status.inviteTag
      );
    });
  };

  const calculateProbStudentTestsIntoLevel = (level: GenderedLevel) => {
    const recentSessions = dropRight(getAllInitialSessions(students), 13);
    const recentStudents = filter(students, (student) => {
      return includes(recentSessions, student.initialSession);
    });
    return (
      filter(recentStudents, (student) => {
        return (
          ((level.includes("PL1") && student.origPlacementData?.level === "PL1") ||
            (!level.includes("PL1") && level.includes(student.origPlacementData?.level))) &&
          ((!level.includes("M") && !level.includes("W")) ||
            (level.includes("M") && student.gender === "M") ||
            (level.includes("W") && student.gender === "F"))
        );
      }).length / recentStudents.length
    );
  };

  const adjustProbUsingMalePercentageInput = (level: GenderedLevel, probNewStudentTestIntoLevel: number) => {
    return level.includes("M")
      ? probNewStudentTestIntoLevel * (1 / historicMalePercentage) * percentageMaleStudentsSafe
      : level.includes("W")
      ? probNewStudentTestIntoLevel * (1 / (1 - historicMalePercentage)) * (1 - percentageMaleStudentsSafe)
      : probNewStudentTestIntoLevel;
  };

  const getCurrentWdAcademicRecords = (
    academicRecords: AcademicRecord[],
    currentSession?: Student["initialSession"],
  ) => {
    return filter(academicRecords, (ar) => {
      return ar.session === currentSession && ar.overallResult === FinalResult.WD;
    }).length;
  };

  const getActiveStudentsInCoreLevel = (
    activeStudentsInLevel: Student[],
    currentSession?: Student["initialSession"],
  ) => {
    return filter(activeStudentsInLevel, (student) => {
      return (
        filter(student.academicRecords, (ar) => {
          return ar.session === currentSession && includes(genderedLevels, ar.level);
        }).length > 0
      );
    });
  };

  const getExpectedStudentResults = (level: GenderedLevel | "", result: "pass" | "fail") => {
    const isPreviousLevel = result === "pass";
    const activeStudents = getActiveStudents();
    const activeStudentsInLevel = getActiveStudentsInLevel(level, isPreviousLevel && !includes(level, "L1"));
    const currentSession = getCurrentSession(students);
    const activeStudentsInCoreLevel = getActiveStudentsInCoreLevel(activeStudentsInLevel, currentSession);
    const allAcademicRecords = flatten(map(students, "academicRecords"));
    const allLevelAcademicRecords = getAcademicRecordsByLevel(
      allAcademicRecords,
      level,
      isPreviousLevel && !includes(level, "L1"),
    );
    const numWDStudentsInLevelThisSession = getCurrentWdAcademicRecords(allLevelAcademicRecords, currentSession);
    const currentWDPercentage = numWDStudentsInLevelThisSession / activeStudentsInLevel.length;
    const levelPassFailCounts = countBy(allLevelAcademicRecords, "overallResult");
    const levelWDPercentage = levelPassFailCounts.WD / allLevelAcademicRecords.length;
    // 27 is the average coefficient of the logarithmic enrollment trendlines from Fall I 2022 - Spring I 2024
    const numExpectedRemainingWdStudentsInLevel =
      totalWeeks === null
        ? Math.max(0, levelWDPercentage - currentWDPercentage) * activeStudentsInLevel.length
        : ((27 * (Math.log(totalWeeksSafe) - Math.log(currentWeekSafe))) / activeStudents.length) *
          activeStudentsInLevel.length;
    const levelFailPercentage = levelPassFailCounts.F / allLevelAcademicRecords.length;
    const levelPassPercentage = levelPassFailCounts.P / allLevelAcademicRecords.length;
    const normalizedLevelPassPercentage = levelPassPercentage / (levelFailPercentage + levelPassPercentage);
    const numExpectedPassedStudentsInLevel =
      finishedCurrentSession || level === ""
        ? 0
        : (activeStudentsInCoreLevel.length -
            numExpectedRemainingWdStudentsInLevel *
              (activeStudentsInCoreLevel.length / activeStudentsInLevel.length)) *
          normalizedLevelPassPercentage;
    const numExpectedFailedStudentsInLevel = finishedCurrentSession
      ? activeStudentsInLevel.length
      : activeStudentsInLevel.length - numExpectedPassedStudentsInLevel - numExpectedRemainingWdStudentsInLevel;

    // if (!isPreviousLevel) {
    //   console.log(level);
    //   console.log(`Fail: ${numExpectedFailedStudentsInLevel}`);
    //   console.log(`Pass: ${numExpectedPassedStudentsInLevel}`);
    //   console.log(`Remaining WD: ${numExpectedRemainingWdStudentsInLevel}`);
    // }

    return [
      result === "pass" ? numExpectedPassedStudentsInLevel : numExpectedFailedStudentsInLevel,
      numExpectedRemainingWdStudentsInLevel,
    ];
  };

  forEach(genderedLevels, (level) => {
    const previousGenderedLevel: GenderedLevel | "" = addGenderIfApplicable(level, getPreviousLevel(level));
    const newStudentsInLevel = getNewStudentsInLevel(level);

    const [numExpectedFailedStudentsInLevel, numExpectedRemainingWdStudentsInLevel] = getExpectedStudentResults(
      level,
      "fail",
    );
    const [numExpectedPassedStudentsInPreviousLevel] = getExpectedStudentResults(previousGenderedLevel, "pass");

    const placementRegistrationCounts = getPlacementRegistrationCounts(students);
    const retInvites = sum(map(placementRegistrationCounts, "inviteCounts.RET"));
    const retRegistrations = sum(map(placementRegistrationCounts, "registrationCounts.RET"));
    const newInvites = sum(map(placementRegistrationCounts, "inviteCounts.NEW"));
    const newRegistrations = sum(map(placementRegistrationCounts, "registrationCounts.NEW"));
    const wdInvites = sum(map(placementRegistrationCounts, "inviteCounts.WD"));
    const wdRegistrations = sum(map(placementRegistrationCounts, "registrationCounts.WD"));

    const probNewStudentTestIntoLevel = calculateProbStudentTestsIntoLevel(level);
    const newStudentTestInLevelProbWithGenderInput = adjustProbUsingMalePercentageInput(
      level,
      probNewStudentTestIntoLevel,
    );
    const wdStudentsInLevelWithInvite = getWdStudentsInLevelWithInvite(level);

    predictedRegistration[level] = {
      NEW: round(
        (newStudentsInLevel.length + numNewStudentsSafe * newStudentTestInLevelProbWithGenderInput) *
          (newRegistrations / newInvites),
      ),
      RET: round(
        (numExpectedFailedStudentsInLevel + numExpectedPassedStudentsInPreviousLevel) *
          (retRegistrations / retInvites),
      ),
      WD: round(
        (numExpectedRemainingWdStudentsInLevel + wdStudentsInLevelWithInvite.length) *
          (wdRegistrations / wdInvites),
      ),
    };
  });
  return predictedRegistration;
};
