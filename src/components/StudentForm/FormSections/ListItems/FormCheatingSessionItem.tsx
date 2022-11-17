import { Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useColors, useStudentStore } from "../../../../hooks";
import { FormItem, getAllSessions } from "../../../../services";
import { GridItemAutocomplete } from "../../../reusables";

export const FormCheatingSessionItem: React.FC<FormItem> = ({ index, removeItem, name }) => {
  const { iconColor } = useColors();
  const students = useStudentStore((state) => {
    return state.students;
  });

  return (
    <>
      <GridItemAutocomplete
        autoSelect={false}
        label="Cheating Session"
        name={name}
        options={getAllSessions(students)}
      />
      <Tooltip arrow title="Remove Cheating Session">
        <IconButton onClick={removeItem && removeItem(index)} sx={{ color: iconColor, height: "100%" }}>
          <Close />
        </IconButton>
      </Tooltip>
    </>
  );
};
