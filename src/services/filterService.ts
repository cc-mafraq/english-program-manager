import { filter, first, isEmpty, last, map, some, split, toLower } from "lodash";
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
  const cleanSearchString = toLower(searchString.replace(nonAlphaNumeric, ""))
    .replaceAll(/[أآإ]/g, "ا")
    .replaceAll("ة", "ه");
  const vowelRegex = /(?<!\b)[aeiou](?!\b)/g;
  const cleanSearchStringNoVowels = cleanSearchString.replaceAll(vowelRegex, "");
  const searchStringRegEx = new RegExp(`^${cleanSearchStringNoVowels}`);
  const splitSearchString = split(cleanSearchStringNoVowels, " ");
  return filter(students, (s) => {
    const cleanName = toLower(s.name.english.replace(nonAlphaNumeric, ""));
    const cleanArabicName = s.name.arabic.replaceAll(/[أآإ]/g, "ا").replaceAll("ة", "ه");
    const cleanNameNoVowels = cleanName.replaceAll(vowelRegex, "");
    const familyCoordinatorNoVowels = s.familyCoordinatorEntry?.replaceAll(vowelRegex, "");
    const splitArabicName = split(s.name?.arabic, " ");
    return (
      isEmpty(searchString) ||
      cleanName.startsWith(cleanSearchString) ||
      !!toLower(cleanNameNoVowels).match(searchStringRegEx) ||
      !!cleanNameNoVowels.match(`^${first(splitSearchString)}(.)*\\s${last(splitSearchString)}$`) ||
      cleanArabicName.startsWith(cleanSearchString) ||
      cleanArabicName.endsWith(cleanSearchString) ||
      !!cleanSearchString.match(`^${first(splitArabicName)}(.)*\\s${last(splitArabicName)}$`) ||
      !!cleanNameNoVowels.match(`${cleanSearchStringNoVowels}$`) ||
      s.epId.toString() === searchString ||
      some(map(s.phone.phoneNumbers, "number"), phoneConditionFn(cleanSearchString)) ||
      !!toLower(familyCoordinatorNoVowels).match(searchStringRegEx)
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
