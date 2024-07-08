import { yupResolver } from "@hookform/resolvers/yup";
import { Logout } from "@mui/icons-material";
import { Box, Breakpoint, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { FinalResult, Status, Student, Withdraw } from "../../interfaces";
import { SPACING, setData, withdrawSchema } from "../../services";
import { FormWithdraw } from "../StudentForm";
import { FormDialog } from "../reusables";

interface WithdrawButtonProps {
  student: Student;
}

const FormWithdrawMemo = React.memo(() => {
  return (
    <Box paddingRight={SPACING * 2}>
      <FormWithdraw />
    </Box>
  );
});
FormWithdrawMemo.displayName = "Withdraw Form";

export const WithdrawButton: React.FC<WithdrawButtonProps> = ({ student }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDialogOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onSubmit = useCallback(
    (data: Withdraw) => {
      if (student.status === undefined) student.status = {};
      student.status.inviteTag = data.inviteTag;
      student.status.noContactList = data.noContactList;
      if (student.status.withdrawDate === undefined) student.status.withdrawDate = [];
      student.status.withdrawDate.push(data.withdrawDate);
      if (data.droppedOutReason !== null) {
        student.status.droppedOutReason = data.droppedOutReason;
      }
      student.status.currentStatus = Status.WD;
      const lastAcademicRecord = student.academicRecords[student.academicRecords.length - 1];
      if (lastAcademicRecord && lastAcademicRecord.overallResult === undefined) {
        lastAcademicRecord.overallResult = FinalResult.WD;
        lastAcademicRecord.finalGrade
          ? (lastAcademicRecord.finalGrade.result = FinalResult.WD)
          : (lastAcademicRecord.finalGrade = { result: FinalResult.WD });
      }
      setData(student, "students", "epId");
      handleDialogClose();
    },
    [handleDialogClose, student],
  );

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { maxWidth: breakpoint };
  }, []);

  const paperStyleProps = useMemo(() => {
    return { paddingLeft: "15px" };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: {
        droppedOutReason: student.status?.droppedOutReason,
        inviteTag: false,
        noContactList: student.status?.noContactList,
      },
      resolver: yupResolver(withdrawSchema),
    };
  }, [student.status?.droppedOutReason, student.status?.noContactList]);

  return (
    <span>
      <Tooltip arrow title="Withdraw Student">
        <IconButton
          onClick={handleDialogOpen}
          sx={
            greaterThanSmall && import.meta.env.VITE_PROJECT_NAME === "ccm-english"
              ? { marginLeft: "50%", transform: "scale(1.25) translate(-50%)" }
              : undefined
          }
        >
          <Logout />
        </IconButton>
      </Tooltip>
      <FormDialog<Withdraw>
        dialogProps={dialogProps}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        paperStyleProps={paperStyleProps}
        useFormProps={useFormProps}
      >
        <FormWithdrawMemo />
      </FormDialog>
    </span>
  );
};
