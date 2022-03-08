import React from "react";
import { GridContainer, GridItemAutocomplete, GridItemTextField, StudentFormLabel } from "..";
import { genderedLevels, statuses, Student } from "../../../interfaces";
import { generateId, getAllSessions, SPACING } from "../../../services";

interface FormProgramInformationProps {
  students: Student[];
}

export const FormProgramInformation: React.FC<FormProgramInformationProps> = ({ students }) => {
  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Program Information</StudentFormLabel>
      <GridContainer>
        <GridItemTextField label="ID" name="epId" value={generateId(students).toString()} />
        <GridItemAutocomplete label="Current Level" options={[...genderedLevels, "L5 GRAD"]} />
        <GridItemAutocomplete
          defaultValue="NEW"
          label="Current Status"
          name="status.currentStatus"
          options={statuses}
        />
        <GridItemAutocomplete freeSolo label="Initial Session" options={getAllSessions(students)} />
      </GridContainer>
    </>
  );
};
