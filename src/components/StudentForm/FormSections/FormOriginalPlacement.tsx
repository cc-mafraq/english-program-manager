import React from "react";
import { levels, levelsPlus } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormLabel, GridContainer, GridItemAutocomplete, GridItemTextField } from "../../reusables";

export const FormOriginalPlacement: React.FC = () => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Original Placement</FormLabel>
      <GridContainer>
        <GridItemAutocomplete
          gridProps={{ sm: true, xs: 6 }}
          label="Writing Placement"
          name="origPlacementData.writing"
          options={levelsPlus}
          textFieldProps={{ required: true }}
        />
        <GridItemAutocomplete
          gridProps={{ sm: true, xs: 6 }}
          label="Speaking Placement"
          name="origPlacementData.speaking"
          options={levelsPlus}
          textFieldProps={{ required: true }}
        />
        <GridItemAutocomplete
          gridProps={{ sm: true, xs: 6 }}
          label="Placement Level"
          name="origPlacementData.level"
          options={levels}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Placement Adjustment" name="origPlacementData.adjustment" />
      </GridContainer>
    </>
  );
};
