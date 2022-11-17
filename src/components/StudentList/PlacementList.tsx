import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { join, map } from "lodash";
import React, { useCallback, useContext, useState } from "react";
import { useStore } from "zustand";
import { FormDialog, FormPlacement, LabeledContainer, LabeledText } from "..";
import { AppContext } from "../../App";
import { useColors } from "../../hooks";
import { Placement, Student } from "../../interfaces";
import { JOIN_STR, placementSchema, removeNullFromObject, setData } from "../../services";

interface PlacementProps {
  data: Student;
}

export const PlacementList: React.FC<PlacementProps> = ({ data: student }) => {
  const store = useContext(AppContext);
  const role = useStore(store, (state) => {
    return state.role;
  });
  const setSelectedStudent = useStore(store, (state) => {
    return state.setSelectedStudent;
  });

  const { iconColor } = useColors();
  const [open, setOpen] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setSelectedStudent(student);
    setOpen(true);
  }, [setSelectedStudent, student]);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
    setSelectedStudent(null);
  }, [setSelectedStudent]);

  const onSubmit = useCallback(
    (data: Placement) => {
      const dataNoNull = removeNullFromObject(data) as Placement;
      student.placement = dataNoNull;
      setData(student, "students", "epId");
      handleDialogClose();
    },
    [handleDialogClose, student],
  );

  return (
    <>
      <LabeledContainer label="Placement" parentContainerProps={{ paddingBottom: 2 }}>
        <LabeledText label="Pending">{student.placement.pending ? "Yes" : undefined}</LabeledText>
        {map(student.placement.placement, (pl, i) => {
          return (
            <div key={`${student.epId}-placement-${i}`}>
              <LabeledText label="Section and Date">{pl.sectionAndDate}</LabeledText>
              <LabeledText label="Notes">{pl.notes}</LabeledText>
            </div>
          );
        })}
        <LabeledText label="Class Schedule Sent Date">
          {join(student.placement.classScheduleSentDate, JOIN_STR)}
        </LabeledText>
        <LabeledText label="Sections Offered">{student.placement.sectionsOffered}</LabeledText>
        <LabeledText label="NA Class Schedule WPM">
          {student.placement.noAnswerClassScheduleWpm ? "Yes" : undefined}
        </LabeledText>
        <LabeledText label="Photo Contact">{student.placement.photoContact}</LabeledText>
        {role === "admin" && (
          <Tooltip arrow title="Edit Placement">
            <IconButton
              onClick={handleDialogOpen}
              sx={{
                color: iconColor,
                height: "100%",
                marginTop: 1.5,
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        )}
      </LabeledContainer>
      <FormDialog
        dialogProps={{ maxWidth: "lg" }}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        useFormProps={{
          defaultValues: student.placement,
          resolver: yupResolver(placementSchema),
        }}
      >
        <FormPlacement standAlone />
      </FormDialog>
    </>
  );
};
