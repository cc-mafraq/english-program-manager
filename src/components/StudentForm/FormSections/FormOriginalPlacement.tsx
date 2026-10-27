import React from "react";
import { levels, levelsPlus } from "../../../interfaces";
import { placementExamsFolder, SPACING } from "../../../services";
import { FormFile, FormLabel, GridContainer, GridItemAutocomplete, GridItemTextField } from "../../reusables";

export const FormOriginalPlacement: React.FC = () => {
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Original Placement</FormLabel>
      <GridContainer>
        <FormFile filePath="origPlacementData.examFile" folderName={placementExamsFolder} gridProps={{ xs: 2 }} />
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
