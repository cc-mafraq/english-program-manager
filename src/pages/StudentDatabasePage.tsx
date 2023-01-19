import React, { useCallback, useRef } from "react";
import {
  FinalGradeReportDialog,
  Loading,
  MenuBar,
  StudentDatabaseToolbar,
  StudentFormDialog,
  StudentList,
} from "../components";
import { usePageState, useStudentFormStore, useStudentStore } from "../hooks";
import { Student } from "../interfaces";
import { searchStudents, sortStudents } from "../services";

export const StudentDatabasePage = () => {
  const filter = useStudentStore((state) => {
    return state.filter;
  });
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const setStudentDialogOpen = useStudentFormStore((state) => {
    return state.setOpen;
  });

  const menuRef = useRef<HTMLDivElement>(null);

  const handleStudentDialogOpen = useCallback(() => {
    setStudentDialogOpen(true);
  }, [setStudentDialogOpen]);

  const {
    filteredList: filteredStudents,
    handleSearchStringChange,
    searchString,
  } = usePageState<Student>({
    collectionName: "students",
    filter,
    requiredValuePath: "name.english",
    searchFn: searchStudents,
    setData: setStudents,
    sortFn: sortStudents,
  });

  // const [update, setUpdate] = useState(true);
  // useEffect(() => {
  //   if (filteredStudents.length && update) {
  //     forEach(filteredStudents, (student) => {
  //       const oldPhotoContact = get(student, "placement.photoContact");
  //       oldPhotoContact && (student.photoContact = oldPhotoContact);
  //       const newPlacement: Placement[] =
  //         get(student, "placement.sectionsOffered") || (get(student, "placement.placement.length") || 0) > 0
  //           ? [
  //               {
  //                 classScheduleSentDate: [],
  //                 placement: map(get(student, "placement.placement"), (p: SectionPlacement) => {
  //                   const oldSectionAndDate = get(p, "sectionAndDate") as string | undefined;
  //                   const newDate = first(oldSectionAndDate?.match(dateRegex));
  //                   const section = first(oldSectionAndDate?.match(/(?<!N\/)[A-B](?!PE)/)) as Section;
  //                   const sectionPlacement: SectionPlacement = {
  //                     level:
  //                       oldSectionAndDate
  //                         ?.replace(newDate ?? "", "")
  //                         .replace(section ?? "", "")
  //                         .replaceAll(/[()]/g, "")
  //                         .trim()
  //                         .replace(/,$/, "")
  //                         .replace(/-$/, "")
  //                         .trim() || "",
  //                   };
  //                   newDate && (sectionPlacement.date = moment(newDate, MOMENT_FORMAT).format(MOMENT_FORMAT));
  //                   section && (sectionPlacement.section = section);
  //                   p.notes && (sectionPlacement.notes = p.notes);
  //                   return sectionPlacement;
  //                 }),
  //                 session: moment(
  //                   (get(student, "placement") as unknown as Placement | undefined)?.classScheduleSentDate,
  //                   MOMENT_FORMAT,
  //                 ).isBefore("2022-09-01")
  //                   ? "Fa I 22"
  //                   : "Fa II 22",
  //                 ...omit(student.placement, ["photoContact", "session", "placement"]),
  //               },
  //             ]
  //           : [];
  //       student.placement = map(newPlacement, (p) => {
  //         p.placement = _filter(p.placement, (sp) => {
  //           return !isEmpty(sp.level);
  //         });
  //         return p;
  //       });
  //       setData(student, "students", "epId");
  //     });
  //     setUpdate(false);
  //   }
  // }, [filteredStudents, update]);

  return (
    <>
      <MenuBar innerRef={menuRef} pageName="Student Database" />
      <StudentDatabaseToolbar
        filteredStudents={filteredStudents}
        handleSearchStringChange={handleSearchStringChange}
        handleStudentDialogOpen={handleStudentDialogOpen}
        searchString={searchString}
      />
      <Loading />
      <StudentList
        filteredStudents={filteredStudents}
        handleStudentDialogOpen={handleStudentDialogOpen}
        menuRef={menuRef}
      />
      <StudentFormDialog handleSearchStringChange={handleSearchStringChange} />
      <FinalGradeReportDialog />
    </>
  );
};
