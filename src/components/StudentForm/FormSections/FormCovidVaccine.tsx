import { Grid } from "@mui/material";
import moment from "moment";
import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { FormImageActions, GridContainer, GridItemAutocomplete, Image, StudentFormLabel } from "../..";
import { AppContext, CovidStatus, covidStatuses, Student } from "../../../interfaces";
import { covidVaccineImageFolder, MOMENT_FORMAT, SPACING } from "../../../services";
import { GridItemDatePicker, GridItemTextField, LabeledCheckbox } from "../FormInputs";

export const FormCovidVaccine: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);
  const { watch } = useFormContext<Student>();
  const covidStatus = watch("covidVaccine.status");

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>COVID Vaccine</StudentFormLabel>
      <GridContainer>
        <Grid item xs={2}>
          <Image
            folderName={covidVaccineImageFolder}
            imagePath="covidVaccine.imageName"
            imageStyleProps={{ height: "100%", maxHeight: "100%", maxWidth: "100%" }}
            innerContainerProps={{
              sx: { transform: "translate(0%, -50%)" },
              top: "50%",
            }}
            outerContainerProps={{ height: "100%" }}
            scale={2}
            student={selectedStudent}
          />
        </Grid>
        <FormImageActions folderName={covidVaccineImageFolder} imagePath="covidVaccine.imageName" />
        <GridItemAutocomplete
          defaultValue={CovidStatus.FULL}
          label="Vaccine Status"
          name="covidVaccine.status"
          options={covidStatuses}
        />
        <GridItemDatePicker label="Date" name="covidVaccine.date" value={moment().format(MOMENT_FORMAT)} />
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
