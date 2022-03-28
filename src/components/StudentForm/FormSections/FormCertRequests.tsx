import React from "react";
import { GridContainer, GridItemTextField, StudentFormLabel } from "..";
import { SPACING } from "../../../services";

export const FormCertRequests: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Certificate Requests</StudentFormLabel>
      <GridContainer>
        <GridItemTextField label="Request and Date" name="certificateRequests" />
      </GridContainer>
    </>
  );
};
