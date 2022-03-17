import React from "react";
import { GridContainer, GridItemAutocomplete, GridItemDatePicker, StudentFormLabel } from "..";
import { withdrawReasons } from "../../../interfaces";
import { SPACING } from "../../../services";
import { GridItemTextField } from "../FormInputs";

export const FormStatus: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Status</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemDatePicker label="Withdraw Date" name="status.withdrawDate" />
        <GridItemAutocomplete label="Withdraw Reason" name="status.droppedOutReason" options={withdrawReasons} />
        <GridItemDatePicker label="Reactivated Date" name="status.reactivatedDate" />
      </GridContainer>
      <GridContainer>
        <GridItemDatePicker label="Final Grade Report Sent" name="status.finalGradeSentDate" />
        <GridItemDatePicker label="Level Reeval Date" name="status.levelReevalDate" />
        <GridItemTextField label="Audit" name="status.audit" />
      </GridContainer>
    </>
  );
};
