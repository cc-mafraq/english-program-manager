import React, { useContext } from "react";
import { GridContainer, GridItemAutocomplete, GridItemTextField, StudentFormLabel } from "..";
import { AppContext, genderedLevels, statuses } from "../../../interfaces";
import { generateId, getAllSessions, SPACING } from "../../../services";

export const FormProgramInformation: React.FC = () => {
  const {
    appState: { students },
  } = useContext(AppContext);

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Program Information</StudentFormLabel>
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
          defaultValue="NEW"
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
