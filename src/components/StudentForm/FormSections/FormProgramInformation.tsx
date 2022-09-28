import React, { useContext } from "react";
import { AppContext, genderedLevels, Status, statuses } from "../../../interfaces";
import { generateId, getAllSessions, SPACING } from "../../../services";
import { FormLabel, GridContainer, GridItemAutocomplete, GridItemTextField } from "../../reusables";

export const FormProgramInformation: React.FC = () => {
  const {
    appState: { students },
  } = useContext(AppContext);

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Program Information</FormLabel>
      <GridContainer>
        <GridItemTextField
          label="ID"
          name="epId"
          textFieldProps={{ required: true }}
          value={generateId(students).toString()}
        />
        <GridItemAutocomplete
          label="Current Level"
          options={[...genderedLevels, "L5 GRAD"]}
          textFieldProps={{ required: true }}
        />
        <GridItemAutocomplete
          defaultValue={Status.NEW}
          label="Current Status"
          name="status.currentStatus"
          options={statuses}
          textFieldProps={{ required: true }}
        />
        <GridItemAutocomplete
          freeSolo
          label="Initial Session"
          options={getAllSessions(students)}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Family Coordinator Entry" name="familyCoordinatorEntry" />
      </GridContainer>
    </>
  );
};
