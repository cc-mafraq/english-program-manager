import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CovidStatus, covidStatuses, Student } from "../../../interfaces";
import { covidVaccineImageFolder, SPACING } from "../../../services";
import {
  FormImage,
  FormLabel,
  GridContainer,
  GridItemAutocomplete,
  GridItemDatePicker,
  GridItemTextField,
  LabeledCheckbox,
} from "../../reusables";

export const FormCovidVaccine: React.FC = () => {
  const { watch } = useFormContext<Student>();
  const covidStatus = watch("covidVaccine.status");

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>COVID Vaccine</FormLabel>
      <GridContainer>
        <FormImage
          folderName={covidVaccineImageFolder}
          gridProps={{ sm: 2, xs: 4 }}
          imagePath="covidVaccine.imageName"
          imageStyleProps={{ height: "100%", maxHeight: "100%", maxWidth: "100%" }}
          loadingContainerProps={{ marginLeft: "70px", marginTop: 0, transform: "none" }}
          outerContainerProps={{ height: "100%" }}
        />
        <GridItemAutocomplete
          defaultValue={CovidStatus.NORPT}
          gridProps={{ sm: true, xs: 8 }}
          label="Vaccine Status"
          name="covidVaccine.status"
          options={covidStatuses}
          textFieldProps={{ required: true }}
        />
        <GridItemDatePicker gridProps={{ sm: true, xs: 4 }} label="Date" name="covidVaccine.date" />
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
