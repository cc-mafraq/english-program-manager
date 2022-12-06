import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { Breakpoint, IconButton, Tooltip } from "@mui/material";
import { join, map } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { FormDialog, FormPlacement, LabeledContainer, LabeledText } from "..";
import { useAppStore, useColors, useStudentStore } from "../../hooks";
import { Placement, Student } from "../../interfaces";
import { JOIN_STR, placementSchema, removeNullFromObject, setData } from "../../services";

interface PlacementProps {
  data: Student;
}

const FormPlacementMemo = React.memo(() => {
  return <FormPlacement standAlone />;
});
FormPlacementMemo.displayName = "Placement Form";

export const PlacementList: React.FC<PlacementProps> = ({ data: student }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const setSelectedStudent = useStudentStore((state) => {
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

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { maxWidth: breakpoint };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: student.placement,
      resolver: yupResolver(placementSchema),
    };
  }, [student.placement]);

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
      <FormDialog<Placement>
        dialogProps={dialogProps}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        useFormProps={useFormProps}
      >
        <FormPlacementMemo />
      </FormDialog>
    </>
  );
};
