import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { Box, Breakpoint, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { find, findIndex, forEach, join, map, omit, reverse } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import {
  AccordionList,
  EditFn,
  FormDialog,
  FormLabel,
  FormPlacementSessionItem,
  GridItemDatePicker,
  LabeledContainer,
  LabeledText,
} from "..";
import { useAppStore, useColors, useStudentStore } from "../../hooks";
import { emptyPlacement, Placement, Student } from "../../interfaces";
import {
  FormItem,
  JOIN_STR,
  photoContactSchema,
  placementSchema,
  removeNullFromObject,
  setData,
  SPACING,
} from "../../services";

interface PlacementProps {
  data: Student;
}

const FormPlacementMemo = React.memo(({ index }: FormItem) => {
  return (
    <Box paddingRight={SPACING * 2}>
      <FormPlacementSessionItem index={index} />
    </Box>
  );
});
FormPlacementMemo.displayName = "Placement Form";

interface PlacementAccordionSummaryProps {
  data: Placement;
  handleEditClick?: EditFn;
  i: number;
}

const PlacementAccordionSummary: React.FC<PlacementAccordionSummaryProps> = ({
  data: placement,
  i,
  handleEditClick,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const { iconColor } = useColors();

  return (
    <>
      <Typography sx={{ marginLeft: "5vw", marginTop: "5px", width: "55vw" }} variant="h6">
        {placement.session}
      </Typography>
      {role === "admin" && (
        <Tooltip arrow title="Edit Placement">
          <IconButton
            onClick={handleEditClick && handleEditClick(i)}
            sx={{
              color: iconColor,
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

PlacementAccordionSummary.defaultProps = {
  handleEditClick: undefined,
};

interface PlacementAccordionDetailsProps {
  data: Placement;
}

const PlacementAccordionDetails: React.FC<PlacementAccordionDetailsProps> = ({ data: placement }) => {
  return (
    <>
      {map(placement.placement, (pl, i) => {
        return (
          <LabeledContainer
            key={`placement-${placement.session}-${i}`}
            label={`Placement${placement.placement.length > 1 ? ` ${i + 1}` : ""}`}
          >
            <LabeledText label="Level">{pl.level}</LabeledText>
            <LabeledText label="Section">{pl.section}</LabeledText>
            <LabeledText label="Date">{pl.date}</LabeledText>
            <LabeledText label="Notes">{pl.notes}</LabeledText>
          </LabeledContainer>
        );
      })}
      <LabeledContainer label="Pre-Placement">
        <LabeledText label="Pending">{placement.pending ? "Yes" : undefined}</LabeledText>
        <LabeledText label="NA Class Schedule WPM">
          {placement.noAnswerClassScheduleWpm ? "Yes" : undefined}
        </LabeledText>
        <LabeledText label="Sections Offered">{placement.sectionsOffered}</LabeledText>
        <LabeledText label="Class Schedule Sent Date">
          {join(placement.classScheduleSentDate, JOIN_STR)}
        </LabeledText>
      </LabeledContainer>
    </>
  );
};

export const PlacementList: React.FC<PlacementProps> = ({ data: student }) => {
  const setSelectedStudent = useStudentStore((state) => {
    return state.setSelectedStudent;
  });
  const role = useAppStore((state) => {
    return state.role;
  });

  const [open, setOpen] = useState(false);
  const [openPhotoContact, setOpenPhotoContact] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);

  const handleAddButtonClick = useCallback(() => {
    setSelectedStudent(null);
    setOpen(true);
  }, [setSelectedStudent]);

  const handleDialogOpen = useCallback(() => {
    setSelectedStudent(student);
    setOpen(true);
  }, [setSelectedStudent, student]);

  const handleEditClick = useCallback(
    (index: number) => {
      return (e: React.MouseEvent) => {
        setSelectedPlacement(reverse([...student.placement])[index]);
        handleDialogOpen();
        e.stopPropagation();
      };
    },
    [handleDialogOpen, student.placement],
  );

  const handleDialogClose = useCallback(() => {
    setOpen(false);
    setSelectedStudent(null);
  }, [setSelectedStudent]);

  const onSubmit = useCallback(
    (data: Placement) => {
      const dataNoNull = removeNullFromObject(data) as Placement;
      if (selectedPlacement) {
        const recordIndex = findIndex(student.placement, selectedPlacement);
        student.placement[recordIndex] = dataNoNull;
      } else {
        student.placement.push(dataNoNull);
      }
      forEach(dataNoNull.placement, (sp) => {
        if (
          !find(student.academicRecords, (academicRecord) => {
            return academicRecord.session === dataNoNull.session && sp.level && academicRecord.level === sp.level;
          }) &&
          dataNoNull.session !== "Fa I 22" &&
          dataNoNull.session !== "Fa II 22"
        ) {
          student.academicRecords.push({ level: sp.level, session: dataNoNull.session });
        }
      });
      setData(student, "students", "epId");
      handleDialogClose();
    },
    [handleDialogClose, selectedPlacement, student],
  );

  const onSubmitPhotoContact = useCallback(
    (data: { photoContact?: string }) => {
      if (data.photoContact) {
        student.photoContact = data.photoContact;
        setData(student, "students", "epId");
      } else if (student.photoContact) {
        setData(omit(student, "photoContact"), "students", "epId");
      }
      setOpenPhotoContact(false);
    },
    [student],
  );

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { maxWidth: breakpoint };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: selectedPlacement || emptyPlacement,
      resolver: yupResolver(placementSchema),
    };
  }, [selectedPlacement]);

  const usePhotoContactFormProps = useMemo(() => {
    return {
      defaultValues: { photoContact: student.photoContact },
      resolver: yupResolver(photoContactSchema),
    };
  }, [student.photoContact]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ marginBottom: "5px" }}>
        {role === "admin" && (
          <Box marginTop={1} padding={1} width="100%">
            <Button color="secondary" onClick={handleAddButtonClick} variant="contained">
              Add Placement Session
            </Button>
          </Box>
        )}
        <AccordionList
          dataList={reverse([...student.placement])}
          DetailsComponent={PlacementAccordionDetails}
          handleEditClick={handleEditClick}
          SummaryComponent={PlacementAccordionSummary}
        />
        <FormDialog<Placement>
          dialogProps={dialogProps}
          handleDialogClose={handleDialogClose}
          onSubmit={onSubmit}
          open={open}
          useFormProps={useFormProps}
        >
          <FormPlacementMemo
            index={selectedPlacement ? findIndex(student.placement, selectedPlacement) : undefined}
          />
        </FormDialog>
      </Box>
      <Box display="flex" flexDirection="row" marginLeft="15px">
        <LabeledText label="Photo Contact">{student.photoContact}</LabeledText>
        <Box sx={{ minHeight: "30px", position: "relative" }}>
          <Box sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)" }}>
            <Tooltip arrow title="Edit Photo Contact">
              <IconButton
                onClick={() => {
                  setOpenPhotoContact(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <FormDialog<{ photoContact?: string }>
        dialogProps={{ ...dialogProps, fullWidth: false }}
        handleDialogClose={() => {
          setOpenPhotoContact(false);
        }}
        onSubmit={onSubmitPhotoContact}
        open={openPhotoContact}
        useFormProps={usePhotoContactFormProps}
      >
        <FormLabel>Photo Contact</FormLabel>
        <GridItemDatePicker
          gridProps={{ sx: { marginTop: "15px", width: "50%" } }}
          label="Photo Contact"
          name="photoContact"
        />
      </FormDialog>
    </Box>
  );
};
