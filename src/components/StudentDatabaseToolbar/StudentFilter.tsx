import { first, includes, range } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import {
  AppContext,
  covidStatuses,
  genderedLevels,
  nationalities,
  statusDetails,
  statuses,
  Student,
} from "../../interfaces";
import { FilterField, getAllSessions, getSessionsWithResults, getStatusDetails } from "../../services";
import { FilterDrawer } from "../reusables";

interface StudentFilterProps {
  anchorEl?: HTMLButtonElement | null;
  handleClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const booleanCheckboxOptions = ["Yes", "No"];

export const StudentFilter: React.FC<StudentFilterProps> = ({ anchorEl, handleClose }) => {
  const {
    appState: { students, role },
    appDispatch,
  } = useContext(AppContext);

  const sessionsWithResults = getSessionsWithResults(students);
  const isAdmin = role === "admin";
  const isAdminOrFaculty = isAdmin || role === "faculty";

  const statusDetailsFn = useCallback(
    (student: Student) => {
      return getStatusDetails({ sessions: sessionsWithResults, student })[0];
    },
    [sessionsWithResults],
  );

  const sessionsAttendedFn = useCallback(
    (student: Student) => {
      return getStatusDetails({ sessions: sessionsWithResults, student })[1];
    },
    [sessionsWithResults],
  );

  const whatsAppGroupFn = useCallback((student: Student) => {
    const includesRemove = includes(student.phone.waBroadcastSAR?.toLowerCase(), "remove");
    if (includes(student.phone.waBroadcastSAR?.toLowerCase(), "group") && !includesRemove) {
      return (
        `SAR ${first(student.phone.waBroadcastSAR?.match(/Group \d/))}` ||
        `SAR Group ${first(student.phone.waBroadcastSAR?.match(/\d/))}`
      );
    }
    if (includes(student.phone.waBroadcastSAR, "Y") && !includesRemove) {
      return "SAR Group 1";
    }
    return "None";
  }, []);

  const handleClearFilters = useCallback(() => {
    appDispatch({ payload: { studentFilter: [] } });
  }, [appDispatch]);

  const filterFields: FilterField[] = useMemo(() => {
    return [
      { condition: isAdmin, name: "Invite", path: "status.inviteTag", values: booleanCheckboxOptions },
      { condition: isAdmin, name: "Placement Pending", path: "placement.pending", values: ["Yes"] },
      {
        condition: isAdmin,
        name: "No Answer Class Schedule WPM",
        path: "placement.noAnswerClassScheduleWpm",
        values: ["Yes"],
      },
      { name: "Current Level", path: "currentLevel", values: [...genderedLevels, "L5 GRAD"] },
      { name: "Current Status", path: "status.currentStatus", values: statuses },
      { condition: isAdmin, name: "COVID Vaccine Status", path: "covidVaccine.status", values: covidStatuses },
      { condition: isAdminOrFaculty, name: "Teacher", path: "work.isTeacher", values: ["Yes"] },
      { condition: isAdminOrFaculty, name: "English Teacher", path: "work.isEnglishTeacher", values: ["Yes"] },
      { name: "Initial Session", path: "initialSession", values: getAllSessions(students) },
      { name: "Nationality", path: "nationality", values: nationalities },
      { name: "Gender", path: "gender", values: ["Male", "Female"] },
      {
        condition: isAdmin,
        fn: whatsAppGroupFn,
        name: "WA BC Group",
        path: "phone.waBroadcastSAR",
        values: ["None", "SAR Group 1", "SAR Group 2", "SAR Group 3", "SAR Group 4", "SAR Group 5", "SAR Group 6"],
      },
      {
        condition: isAdminOrFaculty,
        fn: statusDetailsFn,
        name: "Status Details",
        path: "statusDetails",
        values: statusDetails,
      },
      { condition: isAdminOrFaculty, name: "Dropped Out Reason", path: "status.droppedOutReason" },
      { fn: sessionsAttendedFn, name: "Sessions Attended", path: "sessionsAttended", values: range(11) },
    ];
  }, [isAdmin, isAdminOrFaculty, sessionsAttendedFn, statusDetailsFn, students, whatsAppGroupFn]);
  return (
    <FilterDrawer
      anchorEl={anchorEl}
      data={students}
      filterFields={filterFields}
      filterStatePath="studentFilter"
      handleClearFilters={handleClearFilters}
      handleClose={handleClose}
    />
  );
};

StudentFilter.defaultProps = {
  anchorEl: null,
  handleClose: undefined,
};
