import { FormLabel, FormLabelProps } from "@mui/material";
import { parseInt } from "lodash";
import React, { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { ResultBox } from "../..";
import { useAppStore } from "../../../hooks";
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
  onPercentageChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
  onPercentageChange: onPercentageChangeExt,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const { setValue, watch } = useFormContext();

  const onPercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(
      `${gradePath}.result`,
      parseInt(e.target.value) >= 80 ? "P" : parseInt(e.target.value) < 80 ? "F" : null,
    );
    onPercentageChangeExt && onPercentageChangeExt(e);
  };

  return (
    <>
      <FormLabel sx={{ fontWeight: 600, marginBottom: -SPACING, marginLeft: SPACING }} {...textProps}>
        {label}
      </FormLabel>
      <GridContainer marginBottom={0} marginLeft={0.5}>
        {role === "admin" ? (
          <GridItemRadioGroup
            gridProps={{ sm: 3 }}
            name={directGradePath ? gradePath : `${gradePath}.result`}
            options={results}
          />
        ) : (
          <ResultBox
            containerProps={{ marginLeft: "1vw" }}
            result={watch(directGradePath ? gradePath : `${gradePath}.result`)}
            showEmpty
          />
        )}
        {percentageComponent || (
          <GridItemTextField
            gridProps={{ sm: 3 }}
            label="Percentage"
            name={`${gradePath}.percentage`}
            textFieldProps={{ onChange: onPercentageChange }}
          />
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
  onPercentageChange: undefined,
  percentageComponent: undefined,
  textProps: undefined,
};
