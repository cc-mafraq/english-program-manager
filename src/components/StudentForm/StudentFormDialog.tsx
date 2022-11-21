import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty, omit } from "lodash";
import React, { useCallback } from "react";
import { useStudentFormStore, useStudentStore } from "../../hooks";
import { Status, Student } from "../../interfaces";
import {
  deleteImage,
  deleteStudentData,
  removeNullFromObject,
  setData,
  setPrimaryNumberBooleanArray,
  studentFormSchema,
} from "../../services";
import { FormDialog } from "../reusables";
import { StudentForm } from "./StudentForm";

interface StudentFormDialogProps {
  handleSearchStringChange: (value: string) => void;
}

export const StudentFormDialog: React.FC<StudentFormDialogProps> = ({ handleSearchStringChange }) => {
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
      if (isEmpty(data.academicRecords) && data.status.currentStatus === Status.NEW) {
        data.academicRecords = [
          {
            level: data.currentLevel,
            session: data.initialSession,
          },
        ];
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
      setData(dataNoNull, "students", "epId");
      dataNoNull.epId !== selectedStudent?.epId && selectedStudent && deleteStudentData(selectedStudent);
      !selectedStudent && handleSearchStringChange(dataNoNull.epId.toString());
      handleStudentDialogClose();
    },
    [handleSearchStringChange, handleStudentDialogClose, selectedStudent],
  );

  return (
    <FormDialog
      dialogProps={{
        fullScreen: true,
        sx: {
          width: "100%",
        },
      }}
      handleDialogClose={handleStudentDialogClose}
      onSubmit={studentFormOnSubmit}
      open={open}
      stickySubmit
      useFormProps={{
        defaultValues: setPrimaryNumberBooleanArray(selectedStudent, "phone.phoneNumbers"),
        resolver: yupResolver(studentFormSchema),
      }}
    >
      <StudentForm />
    </FormDialog>
  );
};
