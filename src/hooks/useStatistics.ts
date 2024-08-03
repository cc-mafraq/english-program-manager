import { countBy, dropRight, filter, find, findIndex, forEach, get, includes, last, map, omit, set } from "lodash";
import { useCallback } from "react";
import {
  CovidStatus,
  DroppedOutReason,
  FinalResult,
  GenderedLevel,
  Level,
  Nationality,
  Status,
  StatusDetails,
  Student,
  WaitlistOutcome,
} from "../interfaces";
import { getAllSessionsWithPlacement, getSessionsWithResults, getStatusDetails, isActive } from "../services";
import { useStudentStore, useWaitingListStore } from "./useStores";

interface GenderStats {
  F: number;
  M: number;
}

interface Statistics {
  activeGenderCounts: GenderStats;
  activeLevelCounts: { [key in Level]: number };
  activeNationalityCounts: { [key in Nationality]: number };
  averageAge: number;
  covidStatusCounts: { [key in CovidStatus]: number };
  droppedOutReasonCounts: { [key in DroppedOutReason]: number };
  fullVaccineNationalityCounts: { [key in Nationality]: number };
  genderCounts: GenderStats;
  levelCounts: { [key in Level]: number };
  nationalityCounts: { [key in Nationality]: number };
  placementRegistrationCounts: {
    inviteCounts: { [key in Status]: number };
    registrationCounts: { [key in Status]: number };
    session: Student["initialSession"];
  }[];
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
      return s.covidVaccine?.status === CovidStatus.FULL;
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

  const statistics: Statistics = {
    activeGenderCounts: countBy(filterIsActive(), "gender") as unknown as GenderStats,
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
    genderCounts: countBy(students, "gender") as unknown as GenderStats,
    levelCounts: countBy(students, "currentLevel") as { [key in GenderedLevel]: number },
    nationalityCounts: countBy(students, "nationality") as { [key in Nationality]: number },
    placementRegistrationCounts,
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
    if (student.status?.inviteTag) statistics.totalEligible += 1;
    if (student.work?.isEnglishTeacher) statistics.totalEnglishTeachers += 1;
    if (student.literacy?.illiterateAr) statistics.totalIlliterateArabic += 1;
    if (student.literacy?.illiterateEng) statistics.totalIlliterateEnglish += 1;
    if (student.status?.noContactList) statistics.totalNCL += 1;
    if (last(student.placement)?.pending) statistics.totalPending += 1;
    if (student.work?.isTeacher) statistics.totalTeachers += 1;
  });
  statistics.averageAge /= numStudentsWithAge;

  statistics.totalRegistered = students.length;
  statistics.activeLevelCounts = getLevelCounts(statistics, "activeLevelCounts");
  statistics.levelCounts = getLevelCounts(statistics, "levelCounts");
  return statistics;
};
