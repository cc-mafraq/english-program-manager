import React from "react";
import { GridContainer, GridItemAutocomplete, GridItemTextField, StudentFormLabel } from "..";
import { levels, levelsPlus } from "../../../interfaces";
import { SPACING } from "../../../services";

export const FormOriginalPlacement: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Original Placement</StudentFormLabel>
      <GridContainer>
        <GridItemAutocomplete label="Writing Placement" name="origPlacementData.writing" options={levelsPlus} textFieldProps={{required: true}} />
        <GridItemAutocomplete label="Speaking Placement" name="origPlacementData.speaking" options={levelsPlus} textFieldProps={{required: true}}/>
        <GridItemAutocomplete label="Placement Level" name="origPlacementData.level" options={levels} textFieldProps={{required: true}} />
        <GridItemTextField label="Placement Adjustment" name="origPlacementData.adjustment" />
      </GridContainer>
    </>
  );
};
