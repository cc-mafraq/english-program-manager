import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Breakpoint } from "@mui/material";
import { findIndex, remove } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useAppStore, useStudentStore } from "../../hooks";
import { AcademicRecord, Student, emptyAcademicRecord } from "../../interfaces";
import { SPACING, academicRecordsSchema, removeNullFromObject, setData } from "../../services";
import { FormAcademicRecordsItem } from "../StudentForm";
import { FormDialog } from "../reusables";

interface FormAcademicRecordsDialogProps {
  formTitle?: string;
  handleDialogClose: () => void;
  open: boolean;
  selectedAcademicRecord: AcademicRecord | null;
  shouldSetStudents?: boolean;
  student: Student;
}

const FormAcademicRecordsMemo: React.FC<{ formTitle?: string }> = React.memo(({ formTitle }) => {
  return (
    <Box paddingRight={SPACING * 2}>
      <FormAcademicRecordsItem title={formTitle} />
    </Box>
  );
});
FormAcademicRecordsMemo.displayName = "Academic Records Form";

export const FormAcademicRecordsDialog: React.FC<FormAcademicRecordsDialogProps> = ({
  selectedAcademicRecord,
  student,
  handleDialogClose,
  open,
  formTitle,
  shouldSetStudents,
}) => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const role = useAppStore((state) => {
    return state.role;
  });

  const onSubmit = useCallback(
    (data: AcademicRecord) => {
      const dataNoNull = removeNullFromObject(data) as AcademicRecord;
      if (selectedAcademicRecord) {
        const recordIndex = findIndex(student.academicRecords, selectedAcademicRecord);
        student.academicRecords[recordIndex] = dataNoNull;
      } else {
        student.academicRecords.push(dataNoNull);
      }
      setData(student, "students", "epId");
      shouldSetStudents &&
        setStudents([
          ...remove(students, (s) => {
            return s.epId !== student.epId;
          }),
          student,
        ]);
      handleDialogClose();
    },
    [handleDialogClose, selectedAcademicRecord, setStudents, shouldSetStudents, student, students],
  );

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { fullWidth: role === "admin", maxWidth: breakpoint };
  }, [role]);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: selectedAcademicRecord || emptyAcademicRecord,
      resolver: yupResolver(academicRecordsSchema),
    };
  }, [selectedAcademicRecord]);

  return (
    <FormDialog<AcademicRecord>
      dialogProps={dialogProps}
      handleDialogClose={handleDialogClose}
      onSubmit={onSubmit}
      open={open}
      useFormProps={useFormProps}
    >
      <FormAcademicRecordsMemo formTitle={formTitle} />
    </FormDialog>
  );
};

FormAcademicRecordsDialog.defaultProps = {
  formTitle: undefined,
  shouldSetStudents: undefined,
};
