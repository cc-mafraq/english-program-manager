import { yupResolver } from "@hookform/resolvers/yup";
import { filter, first, get, isEmpty, omit } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useFormDialog, useStudentFormStore, useStudentStore } from "../../hooks";
import { emptyStudent, Student } from "../../interfaces";
import {
  deleteImage,
  deleteStudentData,
  parseArabicName,
  removeNullFromObject,
  setData,
  setPrimaryNumberBooleanArray,
  studentFormSchema,
} from "../../services";
import { FormDialog } from "../reusables";
import { StudentDupNameDialog } from "./StudentDupNameDialog";
import { StudentForm } from "./StudentForm";

interface StudentFormDialogProps {
  handleSearchStringChange: (value: string) => void;
}

const StudentFormMemo: React.FC = React.memo(() => {
  return <StudentForm />;
});
StudentFormMemo.displayName = "Student Form";

export const StudentFormDialog: React.FC<StudentFormDialogProps> = ({ handleSearchStringChange }) => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const setSelectedStudent = useStudentStore((state) => {
    return state.setSelectedStudent;
  });
  const open = useStudentFormStore((state) => {
    return state.open;
  });
  const setOpen = useStudentFormStore((state) => {
    return state.setOpen;
  });

  const handleStudentDialogClose = useCallback(() => {
    setOpen(false);
    setSelectedStudent(null);
  }, [setOpen, setSelectedStudent]);

  const studentFormOnSubmit = useCallback(
    (data: Student) => {
      const primaryPhone = data.phone.phoneNumbers[data.phone.primaryPhone as number]?.number;
      if (primaryPhone) {
        data.phone.primaryPhone = primaryPhone;
      } else {
        // eslint-disable-next-line no-alert
        alert("You must choose a primary phone number.");
        return;
      }
      if (isEmpty(data.academicRecords)) {
        data.academicRecords = [];
      }
      if (!data.imageName && selectedStudent?.imageName) {
        deleteImage(selectedStudent, "imageName", true);
      }
      if (!data.covidVaccine.imageName && selectedStudent?.covidVaccine.imageName) {
        deleteImage(selectedStudent, "covidVaccine.imageName", true);
      }
      const dataNoSuspect = data.covidVaccine.suspectedFraud
        ? data
        : omit(data, "covidVaccine.suspectedFraudReason");
      const dataNoNull = removeNullFromObject(dataNoSuspect) as Student;
      if (!dataNoNull.placement) dataNoNull.placement = [];
      if (!dataNoNull.status?.withdrawDate) dataNoNull.status.withdrawDate = [];
      if (!dataNoNull.status?.reactivatedDate) dataNoNull.status.reactivatedDate = [];
      setData(dataNoNull, "students", "epId");
      dataNoNull.epId !== selectedStudent?.epId && selectedStudent && deleteStudentData(selectedStudent);
      !selectedStudent && handleSearchStringChange(dataNoNull.epId.toString());
      handleStudentDialogClose();
    },
    [handleSearchStringChange, handleStudentDialogClose, selectedStudent],
  );

  const [submitData, setSubmitData] = useState(emptyStudent);
  const [matchedStudentId, setMatchedStudentId] = useState<Student["epId"]>();
  const {
    handleDialogClose: handleDupNameDialogClose,
    handleDialogOpen: handleDupNameDialogOpen,
    openDialog: openDupPhoneDialog,
  } = useFormDialog({ disableBackdropClick: true });

  const checkDuplicateName = useCallback(
    (data: Student) => {
      const newParsedArabicName = parseArabicName(data.name.arabic);
      const matchedNameStudents = filter(students, (student: Student) => {
        const studentParsedArabicName = parseArabicName(student.name.arabic);
        return (
          student.name.english === data.name.english ||
          (studentParsedArabicName &&
            newParsedArabicName &&
            studentParsedArabicName.firstName === newParsedArabicName.firstName &&
            (studentParsedArabicName.fathersName === undefined ||
              newParsedArabicName.fathersName === undefined ||
              studentParsedArabicName.fathersName === newParsedArabicName.fathersName) &&
            (studentParsedArabicName.familyName === undefined ||
              newParsedArabicName.familyName === undefined ||
              studentParsedArabicName.familyName === newParsedArabicName.familyName) &&
            ((studentParsedArabicName.fathersName && newParsedArabicName.fathersName) ||
              (studentParsedArabicName.familyName && newParsedArabicName.familyName)))
        );
      });
      if (matchedNameStudents.length > 0 && !selectedStudent) {
        setSubmitData(data);
        setMatchedStudentId(get(first(matchedNameStudents), "epId"));
        handleDupNameDialogOpen();
      } else {
        studentFormOnSubmit(data);
      }
    },
    [handleDupNameDialogOpen, selectedStudent, studentFormOnSubmit, students],
  );

  const dialogProps = useMemo(() => {
    return {
      fullScreen: true,
      sx: {
        width: "100%",
      },
    };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: setPrimaryNumberBooleanArray(selectedStudent, "phone.phoneNumbers"),
      resolver: yupResolver(studentFormSchema),
    };
  }, [selectedStudent]);

  return (
    <>
      <FormDialog<Student>
        dialogProps={dialogProps}
        handleDialogClose={handleStudentDialogClose}
        onlyLoadWhenOpen
        onSubmit={checkDuplicateName}
        open={open}
        stickySubmit
        useFormProps={useFormProps}
      >
        <StudentFormMemo />
      </FormDialog>
      <StudentDupNameDialog
        data={submitData}
        handleDialogClose={handleDupNameDialogClose}
        handleSearchStringChange={handleSearchStringChange}
        handleStudentDialogClose={handleStudentDialogClose}
        matchedStudentId={matchedStudentId}
        onSubmit={studentFormOnSubmit}
        open={openDupPhoneDialog}
      />
    </>
  );
};
