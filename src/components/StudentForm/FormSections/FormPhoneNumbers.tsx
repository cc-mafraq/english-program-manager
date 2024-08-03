import { Grid } from "@mui/material";
import React from "react";
import { get, useFormContext } from "react-hook-form";
import { useFormList } from "../../../hooks";
import { SPACING } from "../../../services";
import { FormLabel, FormList, GridContainer, GridItemTextField } from "../../reusables";
import { FormPhoneItem } from "./ListItems";

interface FormPhoneNumbersProps<T> {
  noWhatsapp?: boolean;
  phonePath: string;
  selectedData: T | null;
}

export const FormPhoneNumbers = <T extends object>({
  selectedData,
  phonePath,
  noWhatsapp,
}: FormPhoneNumbersProps<T>) => {
  const methods = useFormContext<T>();
  const [phoneNumbers, addPhone, removePhone] = useFormList(
    selectedData ? get(selectedData, phonePath) : [{ number: null }],
    phonePath,
    methods,
  );

  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>{`Phone Numbers${
        noWhatsapp ? (import.meta.env.VITE_PROJECT_NAME !== "ccm-english" ? " and Email" : "") : " and WhatsApp"
      }`}</FormLabel>
      <GridContainer marginBottom={SPACING}>
        <FormList
          addItem={addPhone}
          buttonGridProps={{ sm: 2, xs: 4 }}
          buttonLabel="Add Phone"
          list={phoneNumbers}
          listName={phonePath}
          removeItem={removePhone}
        >
          <FormPhoneItem />
        </FormList>
        {import.meta.env.VITE_PROJECT_NAME !== "ccm-english" && (
          <Grid item sm={3} xs={12}>
            <GridItemTextField gridProps={{ paddingBottom: SPACING, paddingLeft: 0 }} label="Email" name="email" />
          </Grid>
        )}
        {!noWhatsapp && (
          <Grid item sm={3} xs={12}>
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
