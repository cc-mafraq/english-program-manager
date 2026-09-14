import { Grid } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Student } from "../../../interfaces";
import { SPACING, studentImageFolder } from "../../../services";
import { FormImage, GridContainer, GridItemTextField, LabeledCheckbox } from "../../reusables";

export const FormName: React.FC = () => {
  const { watch } = useFormContext<Student>();
  const inviteChecked = watch("status.inviteTag") ?? true;

  return (
    <GridContainer marginBottom={SPACING}>
      <FormImage
        folderName={studentImageFolder}
        gridProps={{ marginBottom: "30px", marginTop: "15px", sm: 1, xs: 12 }}
        imagePath="imageName"
        imageStyleProps={{ margin: "auto", maxHeight: "100%", maxWidth: "90px", width: "auto" }}
        loadingContainerProps={{ marginLeft: "25px", marginTop: 0, transform: "none" }}
        outerContainerProps={{ display: "flex", flexDirection: "row" }}
      />
      <GridItemTextField
        gridProps={{ sm: true, xs: 12 }}
        label="Name - ENG"
        name="name.english"
        textFieldProps={{ required: true }}
      />
      <GridItemTextField label="Name - AR" name="name.arabic" textFieldProps={{ required: true }} />
      <Grid item xs={1}>
        <LabeledCheckbox
          checkboxProps={{ defaultChecked: true }}
          containerProps={{ marginTop: -1 }}
          label="Invite"
          name="status.inviteTag"
        />
        {inviteChecked && (
          <LabeledCheckbox
            containerProps={{ marginTop: -1 }}
            label="High Priority"
            name="status.highPriorityEnrollment"
          />
        )}
        {!inviteChecked && (
          <LabeledCheckbox containerProps={{ marginTop: -1 }} label="NCL" name="status.noContactList" />
        )}
      </Grid>
    </GridContainer>
  );
};
