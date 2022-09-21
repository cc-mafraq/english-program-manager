import { filter, includes, isEmpty, map, some, toLower } from "lodash";
import { Student, WaitingListStudent } from "../interfaces";

const phoneConditionFn = (searchString: string) => {
  return (n: number) => {
    return (
      n?.toString().match(new RegExp(`${searchString}$`)) || n?.toString().match(new RegExp(`^${searchString}`))
    );
  };
};

export const searchStudents = (students: Student[], searchString: string) => {
  return filter(students, (s) => {
    return (
      isEmpty(searchString) ||
      includes(toLower(s.name.english), toLower(searchString)) ||
      includes(s.name.arabic, searchString) ||
      s.epId.toString() === searchString ||
      some(map(s.phone.phoneNumbers, "number"), phoneConditionFn(searchString))
    );
  });
};

export const searchWaitingList = (wlStudents: WaitingListStudent[], searchString: string) => {
  return filter(wlStudents, (wls) => {
    return (
      isEmpty(searchString) ||
      includes(toLower(wls.name), toLower(searchString)) ||
      some(map(wls.phoneNumbers, "number"), phoneConditionFn(searchString))
    );
  });
};
