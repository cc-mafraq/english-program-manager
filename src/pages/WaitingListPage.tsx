import { Upload } from "@mui/icons-material";
import { Input, InputLabel } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { ActionFAB } from "../components";
import { waitlistToList } from "../services";

export const WaitingListPage = () => {
  const [waitingList, setWaitingList] = useState("");
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    file && reader.readAsText(file);

    reader.onloadend = async () => {
      const studentListString = String(reader.result);
      const waitlist = waitlistToList(studentListString);
      setWaitingList(JSON.stringify(waitlist));
    };
  };

  return (
    <>
      <InputLabel htmlFor="import-waiting-list">
        <Input
          id="import-waiting-list"
          inputProps={{ accept: [".txt", ".csv"] }}
          onChange={onInputChange}
          sx={{ display: "none" }}
          type="file"
        />
        <ActionFAB fabProps={{ component: "span" }} tooltipTitle="Import Waiting List">
          <Upload />
        </ActionFAB>
      </InputLabel>
      {waitingList}
    </>
  );
};
