import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty, omit } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useStudentFormStore, useStudentStore } from "../../hooks";
import { Student } from "../../interfaces";
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

const StudentFormMemo: React.FC = React.memo(() => {
  return <StudentForm />;
});
StudentFormMemo.displayName = "Student Form";

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
      const primaryPhone = data.phone?.phoneNumbers[data.phone?.primaryPhone as number]?.number;
      if (primaryPhone) {
        if (data.phone) {
          data.phone.primaryPhone = primaryPhone;
        } else {
          data.phone = { phoneNumbers: [{ number: primaryPhone }], primaryPhone };
        }
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
      if (!data.covidVaccine?.imageName && selectedStudent?.covidVaccine?.imageName) {
        deleteImage(selectedStudent, "covidVaccine.imageName", true);
      }
      const dataNoSuspect = data.covidVaccine?.suspectedFraud
        ? data
        : omit(data, "covidVaccine.suspectedFraudReason");
      const dataNoNull = removeNullFromObject(dataNoSuspect) as Student;
      if (!dataNoNull.placement) dataNoNull.placement = [];
      setData(dataNoNull, "students", "epId");
      dataNoNull.epId !== selectedStudent?.epId && selectedStudent && deleteStudentData(selectedStudent);
      !selectedStudent && handleSearchStringChange(dataNoNull.epId.toString());
      handleStudentDialogClose();
    },
    [handleSearchStringChange, handleStudentDialogClose, selectedStudent],
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
    <FormDialog<Student>
      dialogProps={dialogProps}
      handleDialogClose={handleStudentDialogClose}
      onlyLoadWhenOpen
      onSubmit={studentFormOnSubmit}
      open={open}
      stickySubmit
      useFormProps={useFormProps}
    >
      <StudentFormMemo />
    </FormDialog>
  );
};
