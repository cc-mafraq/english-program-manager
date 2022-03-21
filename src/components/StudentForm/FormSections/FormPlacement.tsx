import { Grid } from "@mui/material";
import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { GridContainer, GridItemDatePicker, GridItemTextField, LabeledCheckbox, StudentFormLabel } from "..";
import { useFormList } from "../../../hooks";
import { AppContext, Student } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormList } from "../FormList";
import { FormDateItem } from "./ListItems";

export const FormPlacement: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  const methods = useFormContext<Student>();

  const [classListSentDate, addClassListSentDate, removeClassListSentDate] = useFormList(
    selectedStudent &&
      selectedStudent.placement.classListSentDate &&
      selectedStudent.placement.classListSentDate?.length > 0
      ? selectedStudent?.placement.classListSentDate
      : [""],
    "placement.classListSentDate",
    methods,
  );

  const [confDate, addConfDate, removeConfDate] = useFormList(
    selectedStudent && selectedStudent.placement.confDate && selectedStudent.placement.confDate?.length > 0
      ? selectedStudent?.placement.confDate
      : [""],
    "placement.confDate",
    methods,
  );

  const [photoContact, addPhotoContact, removePhotoContact] = useFormList(
    selectedStudent && selectedStudent.placement.photoContact && selectedStudent.placement.photoContact?.length > 0
      ? selectedStudent?.placement.photoContact
      : [""],
    "placement.photoContact",
    methods,
  );

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Placement</StudentFormLabel>
      <GridContainer marginBottom={0}>
        <GridItemTextField gridProps={{ xs: 6 }} label="Placement" name="placement.placement" />
        <FormList
          addItem={addClassListSentDate}
          buttonLabel="Add CL Sent Date"
          list={classListSentDate}
          listName="placement.classListSentDate"
          removeItem={removeClassListSentDate}
        >
          <FormDateItem>
            <GridItemDatePicker label="Class List Sent Date" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer marginBottom={0}>
        <GridItemTextField gridProps={{ xs: 6 }} label="Sections Offered" name="placement.sectionsOffered" />
        <FormList
          addItem={addConfDate}
          buttonLabel="Add Conf Date"
          list={confDate}
          listName="placement.confDate"
          removeItem={removeConfDate}
        >
          <FormDateItem>
            <GridItemDatePicker label="Confirmed Date" />
          </FormDateItem>
        </FormList>
      </GridContainer>
      <GridContainer>
        <Grid item xs={2}>
          <LabeledCheckbox label="Pending" name="placement.pending" />
        </Grid>
        <Grid item xs={4}>
          <LabeledCheckbox label="No Answer CS WPM" name="placement.noAnswerClassScheduleWPM" />
        </Grid>
        <FormList
          addItem={addPhotoContact}
          buttonLabel="Add Photo Contact"
          list={photoContact}
          listName="placement.photoContact"
          removeItem={removePhotoContact}
        >
          <FormDateItem>
            <GridItemDatePicker label="Photo Contact" />
          </FormDateItem>
        </FormList>
      </GridContainer>
    </>
  );
};
