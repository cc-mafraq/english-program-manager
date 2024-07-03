import React from "react";
import { useStudentStore } from "../../../hooks";
import { genderedLevels, levels, Status, statuses } from "../../../interfaces";
import { generateId, getAllInitialSessions, SPACING } from "../../../services";
import { FormLabel, GridContainer, GridItemAutocomplete, GridItemTextField } from "../../reusables";

export const FormProgramInformation: React.FC = () => {
  const students = useStudentStore((state) => {
    return state.students;
  });

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Program Information</FormLabel>
      <GridContainer>
        <GridItemTextField
          gridProps={{ sm: true, xs: 4 }}
          label="ID"
          name="epId"
          textFieldProps={{ required: true }}
          value={generateId(students).toString()}
        />
        <GridItemAutocomplete
          gridProps={{ sm: true, xs: 8 }}
          label="Current Level"
          options={import.meta.env.VITE_PROJECT_NAME === "ccm-english" ? [...genderedLevels, "L5 GRAD"] : levels}
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
          options={getAllInitialSessions(students)}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Family Coordinator Entry" name="familyCoordinatorEntry" />
      </GridContainer>
    </>
  );
};
