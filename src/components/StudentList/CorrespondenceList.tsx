import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { findIndex, map, reverse } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { LabeledContainer } from ".";
import { FormCorrespondenceItem, FormDialog, StudentFormLabel } from "..";
import { useColors } from "../../hooks";
import { Correspondence, defaultBorderColor, Student } from "../../interfaces";
import { correspondenceSchema, MOMENT_FORMAT, setStudentData } from "../../services";

interface CorrespondenceProps {
  data: Student;
}

export const CorrespondenceList: React.FC<CorrespondenceProps> = ({ data: student }) => {
  const { defaultBackgroundColor, iconColor } = useColors();
  const [open, setOpen] = useState(false);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);

  const handleDialogOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
    setSelectedCorrespondence(null);
  }, []);

  const handleEditClick = useCallback(
    (index: number) => {
      return () => {
        setSelectedCorrespondence(student.correspondence[index]);
        handleDialogOpen();
      };
    },
    [handleDialogOpen, student.correspondence],
  );

  const onSubmit = useCallback(
    (data: Correspondence) => {
      if (selectedCorrespondence) {
        const recordIndex = findIndex(student.correspondence, selectedCorrespondence);
        student.correspondence[recordIndex] = data;
      } else {
        student.correspondence ? student.correspondence.push(data) : (student.correspondence = [data]);
      }
      setStudentData(student);
      handleDialogClose();
    },
    [handleDialogClose, selectedCorrespondence, student],
  );

  const CorrespondenceData = useMemo(() => {
    return reverse(
      map(student.correspondence, (c, i) => {
        return (
          <Box
            key={`${c.date} ${c.notes}`}
            position="relative"
            sx={{
              backgroundColor: defaultBackgroundColor,
              border: 1,
              borderColor: defaultBorderColor,
              marginRight: 1,
              marginTop: 1,
              padding: 1,
              width: "95%",
            }}
          >
            <Tooltip arrow title="Edit Correspondence">
              <IconButton
                onClick={handleEditClick(i)}
                sx={{
                  color: iconColor,
                  position: "absolute",
                  right: "-4vw",
                  top: 0,
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Typography fontSize="11pt" variant="body2">
              {c.date ? `${c.date}: ${c.notes}` : c.notes}
            </Typography>
          </Box>
        );
      }),
    );
  }, [defaultBackgroundColor, handleEditClick, iconColor, student.correspondence]);

  return (
    <>
      <LabeledContainer label="Correspondence" parentContainerProps={{ marginBottom: 2 }}>
        <Box marginBottom={1} marginTop={1} width="100%">
          <Button color="secondary" onClick={handleDialogOpen} variant="contained">
            Add Correspondence
          </Button>
        </Box>
        {CorrespondenceData}
      </LabeledContainer>
      <FormDialog
        dialogProps={{ maxWidth: "lg" }}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        useFormProps={{
          defaultValues: selectedCorrespondence || {
            date: moment().format(MOMENT_FORMAT),
            notes: "",
          },
          resolver: yupResolver(correspondenceSchema),
        }}
      >
        <StudentFormLabel>Correspondence</StudentFormLabel>
        <FormCorrespondenceItem />
      </FormDialog>
    </>
  );
};
