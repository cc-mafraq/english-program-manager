import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Breakpoint } from "@mui/material";
import { findIndex } from "lodash";
import React, { useCallback, useMemo } from "react";
import { AcademicRecord, Student, emptyAcademicRecord } from "../../interfaces";
import { SPACING, academicRecordsSchema, removeNullFromObject, setData } from "../../services";
import { FormAcademicRecordsItem } from "../StudentForm";
import { FormDialog } from "../reusables";

const FormAcademicRecordsMemo = React.memo(() => {
  return (
    <Box paddingRight={SPACING * 2}>
      <FormAcademicRecordsItem />
    </Box>
  );
});
FormAcademicRecordsMemo.displayName = "Academic Records Form";

interface FormAcademicRecordsDialogProps {
  handleDialogClose: () => void;
  open: boolean;
  selectedAcademicRecord: AcademicRecord | null;
  student: Student;
}

export const FormAcademicRecordsDialog: React.FC<FormAcademicRecordsDialogProps> = ({
  selectedAcademicRecord,
  student,
  handleDialogClose,
  open,
}) => {
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
      handleDialogClose();
    },
    [handleDialogClose, selectedAcademicRecord, student],
  );

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { maxWidth: breakpoint };
  }, []);

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
      <FormAcademicRecordsMemo />
    </FormDialog>
  );
};
