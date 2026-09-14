import React from "react";

interface FormWaitingListVaccineProps {
  disabled: boolean;
}

export const FormWaitingListVaccine: React.FC<FormWaitingListVaccineProps> = () =>
  // { disabled }
  {
    // const theme = useTheme();
    // const greaterThanMedium = useMediaQuery(theme.breakpoints.up("md"));

    return (
      <>
        {/* <FormLabel textProps={{ marginTop: SPACING }}>COVID Vaccine</FormLabel>
      <GridContainer marginBottom={greaterThanMedium ? SPACING : 0}>
        <GridItemAutocomplete
          defaultValue={CovidStatus.NORPT}
          disabled={disabled}
          label="Vaccine Status"
          name="covidStatus"
          options={covidStatuses}
          textFieldProps={{ required: true }}
        />
        <GridItemTextField label="Vaccine Notes" name="covidVaccineNotes" textFieldProps={{ disabled }} />
      </GridContainer> */}
      </>
    );
  };
