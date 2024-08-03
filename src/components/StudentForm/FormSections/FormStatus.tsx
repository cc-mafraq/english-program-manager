import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useDateInitialState, useFormList, useStudentStore } from "../../../hooks";
import { Student, withdrawReasons } from "../../../interfaces";
import { SPACING } from "../../../services";
import {
  FormLabel,
  FormList,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  LabeledCheckbox,
} from "../../reusables";
import { FormCheatingSessionItem, FormDateItem } from "./ListItems";

export const FormStatus: React.FC = () => {
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const methods = useFormContext<Student>();

  const [cheatingSessions, addCheatingSession, removeCheatingSession] = useFormList(
    selectedStudent && selectedStudent.status?.cheatingSessions && selectedStudent.status.cheatingSessions.length
      ? selectedStudent.status.cheatingSessions
      : [""],
    "status.cheatingSessions",
    methods,
  );

  const [withdrawDate, addWithdrawDate, removeWithdrawDate] = useFormList(
    useDateInitialState("status.withdrawDate"),
    "status.withdrawDate",
    methods,
  );

  const [reactivatedDate, addReactivatedDate, removeReactivatedDate] = useFormList(
    useDateInitialState("status.reactivatedDate"),
    "status.reactivatedDate",
    methods,
  );

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Status</FormLabel>
      <GridContainer marginBottom={0}>
        <FormList
          addItem={addWithdrawDate}
          buttonGridProps={{ md: 2, sm: 4, xs: 6 }}
          buttonLabel="Add Withdraw Date"
          list={withdrawDate}
          listName="status.withdrawDate"
          removeItem={removeWithdrawDate}
        >
          <FormDateItem>
            <GridItemDatePicker gridProps={{ sm: 5, xs: 4.5 }} label="Withdraw Date" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <FormList
          addItem={addReactivatedDate}
          buttonGridProps={{ md: 2, sm: 4, xs: 6 }}
          buttonLabel="Add Reactivated Date"
          list={reactivatedDate}
          listName="status.reactivatedDate"
          removeItem={removeReactivatedDate}
        >
          <FormDateItem>
            <GridItemDatePicker
              gridProps={{ sm: 5, xs: 4.5 }}
              label="Reactivated Date"
              name="status.reactivatedDate"
            />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <FormList
          addItem={addCheatingSession}
          buttonGridProps={{ md: 2, sm: 4, xs: 6 }}
          buttonLabel="Add Cheating Session"
          list={cheatingSessions}
          listName="status.cheatingSessions"
          removeItem={removeCheatingSession}
        >
          <FormCheatingSessionItem />
        </FormList>
      </GridContainer>
      <GridContainer>
        <GridItemAutocomplete
          autoSelect={false}
          gridProps={{ sm: 5, xs: 4.5 }}
          label="Withdraw Reason"
          name="status.droppedOutReason"
          options={withdrawReasons}
        />
        <GridItemDatePicker label="Level Reevaluation Date" name="status.levelReevalDate" />
        {import.meta.env.VITE_PROJECT_NAME === "ccm-english" && (
          <Grid item>
            <LabeledCheckbox label="ID Card in Box" name="status.idCardInBox" />
          </Grid>
        )}
      </GridContainer>
    </>
  );
};
