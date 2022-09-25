import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CovidStatus, covidStatuses, Student } from "../../../interfaces";
import { covidVaccineImageFolder, SPACING } from "../../../services";
import {
  FormImage,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
} from "../../reusables";
import { StudentFormLabel } from "../StudentFormLabel";

export const FormCovidVaccine: React.FC = () => {
  const { watch } = useFormContext<Student>();
  const covidStatus = watch("covidVaccine.status");

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>COVID Vaccine</StudentFormLabel>
      <GridContainer>
        <FormImage
          folderName={covidVaccineImageFolder}
          imagePath="covidVaccine.imageName"
          imageStyleProps={{ height: "100%", maxHeight: "100%", maxWidth: "100%" }}
          loadingContainerProps={{ marginLeft: "70px", marginTop: 0, transform: "none" }}
          outerContainerProps={{ height: "100%" }}
          xs={2}
        />
        <GridItemAutocomplete
          defaultValue={CovidStatus.FULL}
          label="Vaccine Status"
          name="covidVaccine.status"
          options={covidStatuses}
          textFieldProps={{ required: true }}
        />
        <GridItemDatePicker label="Date" name="covidVaccine.date" />
        {(covidStatus === CovidStatus.UNV || covidStatus === CovidStatus.EXEMPT) && (
          <GridItemTextField label="Reason" name="covidVaccine.reason" />
        )}
        <Grid item>
          <LabeledCheckbox label="Suspected Fraud" name="covidVaccine.suspectedFraud" />
        </Grid>
        {watch("covidVaccine.suspectedFraud") && (
          <GridItemTextField label="Suspected Fraud Reason" name="covidVaccine.suspectedFraudReason" />
        )}
      </GridContainer>
    </>
  );
};
