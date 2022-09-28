import React from "react";
import { SPACING } from "../../../services";
import { FormLabel, GridContainer, GridItemTextField } from "../../reusables";

export const FormCertRequests: React.FC = () => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Certificate Requests</FormLabel>
      <GridContainer>
        <GridItemTextField label="Request and Date" name="certificateRequests" />
      </GridContainer>
    </>
  );
};
