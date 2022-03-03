import React from "react";
import { GridContainer, GridItemAutocomplete, GridItemTextField, StudentFormLabel } from ".";
import { levels, levelsPlus } from "../interfaces";
import { SPACING } from "../services";

export const FormOriginalPlacement: React.FC = () => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Original Placement</StudentFormLabel>
      <GridContainer>
        <GridItemAutocomplete
          label="Writing Placement"
          name="placement.origPlacementData.writing"
          options={levelsPlus}
        />
        <GridItemAutocomplete
          label="Speaking Placement"
          name="placement.origPlacementData.speaking"
          options={levelsPlus}
        />
        <GridItemAutocomplete
          label="Placement Level"
          name="placement.origPlacementData.level"
          options={levels}
        />
        <GridItemTextField
          label="Placement Adjustment"
          name="placement.origPlacementData.adjustment"
        />
      </GridContainer>
    </>
  );
};
