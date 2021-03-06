import { Grid } from "@mui/material";
import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { FormList, FormPhoneItem, GridContainer, GridItemTextField, StudentFormLabel } from "..";
import { useFormList } from "../../../hooks";
import { AppContext, Student } from "../../../interfaces";
import { SPACING } from "../../../services";

export const FormPhoneNumbers: React.FC = () => {
  const {
    appState: { selectedStudent },
  } = useContext(AppContext);

  const methods = useFormContext<Student>();
  const [phoneNumbers, addPhone, removePhone] = useFormList(
    selectedStudent ? selectedStudent.phone.phoneNumbers : [{ number: null }],
    "phone.phoneNumbers",
    methods,
  );

  return (
    <>
      <StudentFormLabel textProps={{ marginTop: SPACING }}>Phone Numbers and WhatsApp</StudentFormLabel>
      <GridContainer marginBottom={SPACING}>
        <FormList
          addItem={addPhone}
          buttonGridProps={{ xs: 2 }}
          buttonLabel="Add Phone"
          list={phoneNumbers}
          listName="phone.phoneNumbers"
          removeItem={removePhone}
        >
          <FormPhoneItem />
        </FormList>
        <Grid item xs={4}>
          <GridItemTextField
            gridProps={{ paddingBottom: SPACING, paddingLeft: 0 }}
            label="WhatsApp Broadcast SAR"
            name="phone.waBroadcastSAR"
          />
          <GridItemTextField label="Other WA Broadcast Groups" name="phone.otherWaBroadcastGroups" />
        </Grid>
      </GridContainer>
    </>
  );
};
