import React from "react";
import { SPACING } from "../../../services";
import { GridContainer, GridItemTextField } from "../../reusables";
import { StudentFormLabel } from "../StudentFormLabel";

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
