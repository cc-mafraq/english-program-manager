import { FormLabel, FormLabelProps } from "@mui/material";
import React, { ReactNode } from "react";
import { results } from "../../../interfaces";
import { SPACING } from "../../../services";
import { GridContainer, GridItemRadioGroup, GridItemTextField } from "../../reusables";

interface FormGradeProps {
  directGradePath?: boolean;
  gradePath: string;
  label: string;
  noNotes?: boolean;
  notesLabel?: string;
  notesPath?: string;
  percentageComponent?: ReactNode;
  textProps?: FormLabelProps;
}

export const FormGrade: React.FC<FormGradeProps> = ({
  label,
  gradePath,
  textProps,
  percentageComponent,
  notesLabel,
  notesPath,
  directGradePath,
  noNotes,
}) => {
  return (
    <>
      <FormLabel sx={{ fontWeight: 600, marginBottom: -SPACING, marginLeft: SPACING }} {...textProps}>
        {label}
      </FormLabel>
      <GridContainer marginBottom={0} marginLeft={0.5}>
        <GridItemRadioGroup
          gridProps={{ sm: 3 }}
          name={directGradePath ? gradePath : `${gradePath}.result`}
          options={results}
        />
        {percentageComponent || (
          <GridItemTextField gridProps={{ sm: 3 }} label="Percentage" name={`${gradePath}.percentage`} />
        )}
        {!noNotes && <GridItemTextField label={notesLabel || "Notes"} name={notesPath || `${gradePath}.notes`} />}
      </GridContainer>
    </>
  );
};

FormGrade.defaultProps = {
  directGradePath: undefined,
  noNotes: undefined,
  notesLabel: undefined,
  notesPath: undefined,
  percentageComponent: undefined,
  textProps: undefined,
};
