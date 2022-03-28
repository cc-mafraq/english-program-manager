import { FormLabel, FormLabelProps } from "@mui/material";
import React from "react";
import { GridContainer, GridItemRadioGroup, GridItemTextField } from "..";
import { results } from "../../../interfaces";
import { SPACING } from "../../../services";

interface FormGradeProps {
  gradePath: string;
  label: string;
  textProps?: FormLabelProps;
}

export const FormGrade: React.FC<FormGradeProps> = ({ label, gradePath, textProps }) => {
  return (
    <>
      <FormLabel sx={{ fontWeight: 600, marginBottom: -SPACING, marginLeft: SPACING }} {...textProps}>
        {label}
      </FormLabel>
      <GridContainer marginBottom={0} marginLeft={0.5}>
        <GridItemRadioGroup gridProps={{ xs: 3 }} name={`${gradePath}.result`} options={results} />
        <GridItemTextField gridProps={{ xs: 3 }} label="Percentage" name={`${gradePath}.percentage`} />
        <GridItemTextField label="Notes" name={`${gradePath}.notes`} />
      </GridContainer>
    </>
  );
};

FormGrade.defaultProps = {
  textProps: undefined,
};
