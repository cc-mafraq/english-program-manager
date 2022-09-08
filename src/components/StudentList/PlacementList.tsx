import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { join, map } from "lodash";
import React, { useCallback, useContext, useState } from "react";
import { LabeledContainer, LabeledText } from ".";
import { FormDialog, FormPlacement } from "..";
import { useColors } from "../../hooks";
import { AppContext, Placement, Student } from "../../interfaces";
import { JOIN_STR, placementSchema, removeNullFromObject, setStudentData } from "../../services";

interface PlacementProps {
  student: Student;
}

export const PlacementList: React.FC<PlacementProps> = ({ student }) => {
  const { appDispatch } = useContext(AppContext);

  const { iconColor } = useColors();
  const [open, setOpen] = useState(false);

  const handleDialogOpen = useCallback(() => {
    appDispatch({ payload: { selectedStudent: student } });
    setOpen(true);
  }, [appDispatch, student]);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
    appDispatch({ payload: { selectedStudent: null } });
  }, [appDispatch]);

  const onSubmit = useCallback(
    (data: Placement) => {
      const dataNoNull = removeNullFromObject(data) as Placement;
      student.placement = dataNoNull;
      setStudentData(student);
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
