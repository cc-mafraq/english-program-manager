import { Button, Checkbox, FormControlLabel, Grid, useTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GridContainer, GridItemAutocomplete, GridItemTextField } from "..";
import { FinalGradeReportFormValues, SPACING } from "../../services";

interface FGRFormProps {
  defaultValues: FinalGradeReportFormValues;
  elective: boolean;
  setElective: React.Dispatch<React.SetStateAction<boolean>>;
  setFgrValues: React.Dispatch<React.SetStateAction<FinalGradeReportFormValues>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const levelOptions = ["Pre-Level 1", "Level 1", "Level 2", "Level 3", "Level 5", "Level 5 Graduate"];

export const FGRForm: React.FC<FGRFormProps> = ({
  defaultValues,
  setFgrValues,
  setIsEditing,
  elective,
  setElective,
}) => {
  const methods = useForm<FinalGradeReportFormValues>({
    criteriaMode: "all",
    defaultValues,
  });
  const theme = useTheme();

  const onSubmit = (data: FinalGradeReportFormValues) => {
    setFgrValues(data);
    setIsEditing(false);
  };

  return (
    <FormProvider {...methods}>
      <form>
        <GridContainer paddingLeft={2}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={elective}
                  onChange={(event, checked) => {
                    setElective(checked);
                  }}
                />
              }
              label="Elective"
            />
          </Grid>
          <GridContainer marginBottom={0}>
            <GridItemTextField label="Name" />
            <GridItemTextField label="Student ID" />
          </GridContainer>
          <GridContainer marginBottom={0}>
            <GridItemTextField label="Session" />
            <GridItemAutocomplete freeSolo label="Level" options={levelOptions} />
          </GridContainer>
          <GridContainer marginBottom={0}>
            <GridItemTextField label="Class Grade" />
            <GridItemTextField label="Attendance" />
          </GridContainer>
          <GridContainer marginBottom={0}>
            <GridItemAutocomplete freeSolo label="Exit Writing Exam" options={["Pass", "Fail"]} />
            <GridItemAutocomplete label="Exit Speaking Exam" options={["Pass", "Fail"]} />
          </GridContainer>
          <GridContainer marginBottom={0}>
            {elective ? (
              <GridItemTextField label="Class Name" />
            ) : (
              <GridItemAutocomplete freeSolo label="Pass or Repeat" options={["Pass", "Repeat"]} />
            )}
            <GridItemAutocomplete freeSolo label="Next Session Level" options={levelOptions} />
          </GridContainer>
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            sx={{
              "&:hover": {
                backgroundColor: green[900],
              },
              backgroundColor: green[800],
              color: theme.palette.mode === "light" ? "white" : grey[200],
              marginTop: SPACING,
            }}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </GridContainer>
      </form>
    </FormProvider>
  );
};
