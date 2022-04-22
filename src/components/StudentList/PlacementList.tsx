import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { join, map, some } from "lodash";
import React, { useContext, useState } from "react";
import { LabeledContainer, LabeledText } from ".";
import { FormDialog, FormPlacement } from "..";
import { useColors } from "../../hooks";
import { AppContext, Placement, Student } from "../../interfaces";
import { JOIN_STR, placementSchema, removeNullFromObject, setStudentData } from "../../services";

interface PlacementProps {
  student: Student;
}

export const PlacementList: React.FC<PlacementProps> = ({ student }) => {
  const {
    appState: { dataVisibility },
    appDispatch,
  } = useContext(AppContext);

  const { iconColor } = useColors();
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    appDispatch({ payload: { selectedStudent: student }, type: "set" });
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    appDispatch({ payload: { selectedStudent: null }, type: "set" });
  };

  const onSubmit = (data: Placement) => {
    const dataNoNull = removeNullFromObject(data) as Placement;
    student.placement = dataNoNull;
    setStudentData(student);
    handleDialogClose();
  };

  return (
    <>
      <LabeledContainer
        condition={some([
          dataVisibility.placement.classScheduleSentDate && student.placement.classScheduleSentDate,
          dataVisibility.placement.naClassScheduleWpm && student.placement.noAnswerClassScheduleWpm,
          dataVisibility.placement.pending && student.placement.pending,
          dataVisibility.placement.photoContact && student.placement.photoContact,
          dataVisibility.placement.placement && student.placement.placement?.length,
          dataVisibility.placement.sectionsOffered && student.placement.sectionsOffered,
        ])}
        label="Placement"
        parentContainerProps={{ paddingBottom: 2 }}
      >
        <LabeledText condition={dataVisibility.placement.photoContact} label="Photo Contact">
          {student.placement.photoContact}
        </LabeledText>
        {map(student.placement.placement, (pl, i) => {
          return dataVisibility.placement.placement ? (
            <div key={`${student.epId}-placement-${i}`}>
              <LabeledText label="Section and Date">{pl.sectionAndDate}</LabeledText>
              <LabeledText label="Notes">{pl.notes}</LabeledText>
              <LabeledText label="Added to CL">{pl.addedToCL ? "Yes" : "No"}</LabeledText>
            </div>
          ) : (
            <></>
          );
        })}
        <LabeledText condition={dataVisibility.placement.classScheduleSentDate} label="Class Schedule Sent Date">
          {join(student.placement.classScheduleSentDate, JOIN_STR)}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.sectionsOffered} label="Sections Offered">
          {student.placement.sectionsOffered}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.naClassScheduleWpm} label="NA Class Schedule WPM">
          {student.placement.noAnswerClassScheduleWpm ? "Yes" : undefined}
        </LabeledText>
        <LabeledText condition={dataVisibility.placement.pending} label="Pending">
          {student.placement.pending ? "Yes" : undefined}
        </LabeledText>
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
