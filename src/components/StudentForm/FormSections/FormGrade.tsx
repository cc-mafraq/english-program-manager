import { FormLabel, FormLabelProps, Grid } from "@mui/material";
import { filter, parseInt } from "lodash";
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
  includeWDOption?: boolean;
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
  includeWDOption,
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
            options={
              includeWDOption
                ? results
                : filter(results, (result) => {
                    return result !== "WD";
                  })
            }
          />
        ) : (
          <Grid item marginTop={-SPACING / 2} minWidth="80px" xs={1.25}>
            <ResultBox
              containerProps={{ marginBottom: SPACING / 2, marginRight: SPACING, minHeight: "45px" }}
              result={watch(directGradePath ? gradePath : `${gradePath}.result`)}
              showEmpty
            />
          </Grid>
        )}
        {percentageComponent || (
          <GridItemTextField
            gridProps={role === "admin" ? { sm: 3 } : { sm: 4.75 }}
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
  includeWDOption: undefined,
  noNotes: undefined,
  notesLabel: undefined,
  notesPath: undefined,
  onPercentageChange: undefined,
  percentageComponent: undefined,
  textProps: undefined,
};
