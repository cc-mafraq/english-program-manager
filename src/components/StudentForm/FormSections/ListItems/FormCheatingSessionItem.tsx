import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import React, { useContext } from "react";
import { GridItemAutocomplete } from "../..";
import { useColors } from "../../../../hooks";
import { AppContext } from "../../../../interfaces";
import { FormItem, getAllSessions } from "../../../../services";

export const FormCheatingSessionItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();
  const {
    appState: { students },
  } = useContext(AppContext);

  return (
    <>
      <GridItemAutocomplete label="Cheating Session" name={name} options={getAllSessions(students)} />
      <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor, height: "100%" }}>
        <CloseIcon />
      </IconButton>
    </>
  );
};
