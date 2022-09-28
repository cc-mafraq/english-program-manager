import { Grid } from "@mui/material";
import React, { useContext } from "react";
import { get, useFormContext } from "react-hook-form";
import { useFormList } from "../../../hooks";
import { AppContext } from "../../../interfaces";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer, GridItemTextField } from "../../reusables";
import { FormPhoneItem } from "./ListItems";

interface FormPhoneNumbersProps {
  noWhatsapp?: boolean;
  phonePath: string;
  selectedStudentPath: string;
}

export const FormPhoneNumbers = <T extends object>({
  selectedStudentPath,
  phonePath,
  noWhatsapp,
}: FormPhoneNumbersProps) => {
  const { appState } = useContext(AppContext);
  const selectedData = get(appState, selectedStudentPath);

  const methods = useFormContext<T>();
  const [phoneNumbers, addPhone, removePhone] = useFormList(
    selectedData ? get(selectedData, phonePath) : [{ number: null }],
    phonePath,
    methods,
  );

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>{`Phone Numbers${
        noWhatsapp ? "" : " and WhatsApp"
      }`}</FormLabel>
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
        {!noWhatsapp && (
          <Grid item xs={3}>
            <GridItemTextField
              gridProps={{ paddingBottom: SPACING, paddingLeft: 0 }}
              label="WhatsApp Broadcast SAR"
              name="phone.waBroadcastSAR"
            />
            <GridItemTextField label="Other WA Broadcast Groups" name="phone.otherWaBroadcastGroups" />
          </Grid>
        )}
      </GridContainer>
    </>
  );
};

FormPhoneNumbers.defaultProps = {
  noWhatsapp: false,
};
