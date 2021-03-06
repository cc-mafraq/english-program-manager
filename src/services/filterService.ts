import { filter, includes, isEmpty, map, some, toLower } from "lodash";
import { Student } from "../interfaces";

export const searchStudents = (students: Student[], searchString: string) => {
  return filter(students, (s) => {
    return (
      isEmpty(searchString) ||
      includes(toLower(s.name.english), toLower(searchString)) ||
      includes(s.name.arabic, searchString) ||
      s.epId.toString() === searchString ||
      some(map(s.phone.phoneNumbers, "number"), (n) => {
        return (
          n?.toString().match(new RegExp(`${searchString}$`)) ||
          n?.toString().match(new RegExp(`^${searchString}`))
        );
      })
    );
  });
};
