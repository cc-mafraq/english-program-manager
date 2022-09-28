import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useDateInitialState, useFormList } from "../../../hooks";
import { AppContext, Student, withdrawReasons } from "../../../interfaces";
import { SPACING } from "../../../services";
import {
  FormLabel,
  FormList,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
} from "../../reusables";
import { FormCheatingSessionItem, FormDateItem } from "./ListItems";

export const FormStatus: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);
  const methods = useFormContext<Student>();

  const [cheatingSessions, addCheatingSession, removeCheatingSession] = useFormList(
    selectedStudent && selectedStudent.status.cheatingSessions && selectedStudent.status.cheatingSessions.length
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
          buttonLabel="Add Withdraw Date"
          list={withdrawDate}
          listName="status.withdrawDate"
          removeItem={removeWithdrawDate}
        >
          <FormDateItem>
            <GridItemDatePicker label="Withdraw Date" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <FormList
          addItem={addReactivatedDate}
          buttonLabel="Add Reactivated Date"
          list={reactivatedDate}
          listName="status.reactivatedDate"
          removeItem={removeReactivatedDate}
        >
          <FormDateItem>
            <GridItemDatePicker label="Reactivated Date" name="status.reactivatedDate" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <GridItemAutocomplete
          autoSelect={false}
          gridProps={{ xs: 6 }}
          label="Withdraw Reason"
          name="status.droppedOutReason"
          options={withdrawReasons}
        />
        <FormList
          addItem={addCheatingSession}
          buttonLabel="Add Cheating Session"
          list={cheatingSessions}
          listName="status.cheatingSessions"
          removeItem={removeCheatingSession}
        >
          <FormCheatingSessionItem />
        </FormList>
      </GridContainer>
      <GridContainer>
        <GridItemDatePicker label="Final Grade Report Sent" name="status.finalGradeSentDate" />
        <GridItemTextField label="Audit" name="status.audit" />
        <GridItemDatePicker label="Level Reeval Date" name="status.levelReevalDate" />
      </GridContainer>
    </>
  );
};
