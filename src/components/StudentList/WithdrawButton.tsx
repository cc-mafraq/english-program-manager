import { yupResolver } from "@hookform/resolvers/yup";
import { Logout } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";
import { FinalResult, Status, Student, Withdraw } from "../../interfaces";
import { setData, SPACING, withdrawSchema } from "../../services";
import { FormDialog } from "../reusables";
import { FormWithdraw } from "../StudentForm";

interface WithdrawButtonProps {
  student: Student;
}

export const WithdrawButton: React.FC<WithdrawButtonProps> = ({ student }) => {
  const [open, setOpen] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onSubmit = useCallback(
    (data: Withdraw) => {
      student.status.inviteTag = data.inviteTag;
      student.status.noContactList = data.noContactList;
      student.status.withdrawDate.push(data.withdrawDate);
      if (data.droppedOutReason !== null) {
        student.status.droppedOutReason = data.droppedOutReason;
      }
      student.status.currentStatus = Status.WD;
      const sessionResult = student.academicRecords[student.academicRecords.length - 1].finalResult;
      if (sessionResult) {
        sessionResult.result = FinalResult.WD;
      } else {
        student.academicRecords[student.academicRecords.length - 1].finalResult = { result: FinalResult.WD };
      }
      setData(student, "students", "epId");
      handleDialogClose();
    },
    [handleDialogClose, student],
  );

  return (
    <Box marginBottom="20px">
      <Tooltip arrow title="Withdraw Student">
        <IconButton
          onClick={handleDialogOpen}
          sx={{ marginLeft: "50%", marginTop: "30px", transform: "scale(1.25) translate(-50%)" }}
        >
          <Logout />
        </IconButton>
      </Tooltip>
      <FormDialog
        dialogProps={{ maxWidth: "lg" }}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        paperStyleProps={{ paddingLeft: "15px" }}
        useFormProps={{
          defaultValues: {
            inviteTag: false,
            noContactList: student.status.noContactList,
          },
          resolver: yupResolver(withdrawSchema),
        }}
      >
        <Box paddingRight={SPACING * 2}>
          <FormWithdraw />
        </Box>
      </FormDialog>
    </Box>
  );
};
