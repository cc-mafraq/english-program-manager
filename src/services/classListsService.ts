import { every, filter, findIndex, first, map, nth, reduce } from "lodash";
import { SectionPlacement, Student } from "../interfaces";
import { getClassName, getStatusDetails } from "./studentService";

const generateClassListNotes = (
  student: Student,
  classListStudents: Student[],
  selectedClass?: SectionPlacement,
  selectedSession?: Student["initialSession"],
) => {
  const sessionIndex = findIndex(student.placement, (placement) => {
    return placement.session === selectedSession;
  });
  const classIndex = findIndex(nth(student.placement, sessionIndex)?.placement, (sectionPlacement) => {
    return getClassName(selectedClass) === getClassName(sectionPlacement);
  });

  return `${
    every(classListStudents, (cls) => {
      return cls.gender === first(classListStudents)?.gender;
    })
      ? ""
      : `${student.gender === "M" ? "Male" : "Female"}. `
  }${
    student.currentLevel === selectedClass?.level ||
    every(classListStudents, (fs) => {
      return fs.currentLevel === first(classListStudents)?.currentLevel;
    })
      ? ""
      : `${student.currentLevel}. `
  }${
    student.currentLevel?.includes("PL1") && student.literacy?.illiterateEng ? "Struggling with literacy. " : ""
  }${map(student.placement[sessionIndex].placement[classIndex].classListNotes, (c) => {
    return `${c.date}: ${c.notes}\n`;
  })}`;
};

export const getClassListCSV = (
  classListStudents: Student[],
  students: Student[],
  selectedClass?: SectionPlacement,
  selectedSession?: Student["initialSession"],
) => {
  return reduce(
    classListStudents,
    (csvString, student) => {
      return `${csvString}"${student.name.english.replaceAll('"', "'")}","${generateClassListNotes(
        student,
        classListStudents,
        selectedClass,
        selectedSession,
      )}","${student.name.arabic}",${student.epId},${student.status?.currentStatus},"${
        getStatusDetails({ student, students })[0]
      }",${student.phone?.primaryPhone},${
        first(
          filter(student.phone?.phoneNumbers, (pn) => {
            return pn.number !== student.phone?.primaryPhone;
          }),
        )?.number ?? ""
      },${student.nationality}\n`;
    },
    "",
  );
};
