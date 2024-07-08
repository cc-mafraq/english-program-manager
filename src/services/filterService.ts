import { filter, includes, isEmpty, map, some, toLower } from "lodash";
import { Student, WaitingListEntry } from "../interfaces";
import { sortWaitingList } from "./waitingListService";

export const phoneConditionFn = (searchString: string) => {
  return (n: number) => {
    return (
      n?.toString().match(new RegExp(`${searchString}$`)) ||
      `${n?.toString()}`.match(new RegExp(`^${searchString}`)) ||
      `0${n?.toString()}`.match(new RegExp(`^${searchString}`))
    );
  };
};

const nonAlphaNumeric = /[^A-Za-z0-9\u0621-\u064A\s]/g;
export const searchStudents = (students: Student[], searchString: string): Student[] => {
  const cleanSearchString = toLower(searchString.replace(nonAlphaNumeric, ""));
  const searchStringRegEx = new RegExp(`^${cleanSearchString}`);
  return filter(students, (s) => {
    const cleanName = toLower(s.name.english.replace(nonAlphaNumeric, ""));
    return (
      isEmpty(searchString) ||
      !!toLower(cleanName).match(searchStringRegEx) ||
      includes(s.name.arabic, searchString) ||
      s.epId.toString() === searchString ||
      some(map(s.phone?.phoneNumbers, "number"), phoneConditionFn(cleanSearchString)) ||
      !!toLower(s.familyCoordinatorEntry).match(searchStringRegEx) ||
      !!`${s.nationalID?.toString()}`.match(searchStringRegEx)
    );
  });
};

export const searchWaitingList = (wlEntries: WaitingListEntry[], searchString: string) => {
  const cleanSearchString = toLower(searchString.replace(nonAlphaNumeric, ""));
  const searchStringRegEx = new RegExp(`^${cleanSearchString}`);
  return sortWaitingList(
    filter(wlEntries, (wle) => {
      return (
        isEmpty(searchString) ||
        !!toLower(wle.name).match(searchStringRegEx) ||
        !!toLower(wle.referral).match(searchStringRegEx) ||
        some(map(wle.phoneNumbers, "number"), phoneConditionFn(cleanSearchString))
      );
    }),
  );
};
