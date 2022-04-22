import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { findIndex, map, reverse } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { LabeledContainer } from ".";
import { useColors } from "../../hooks";
import { Correspondence, defaultBorderColor, Student } from "../../interfaces";
import { correspondenceSchema, MOMENT_FORMAT, setStudentData } from "../../services";
import { FormCorrespondenceItem, StudentFormLabel } from "../StudentForm";
import { FormDialog } from "../StudentForm/FormDialog";

interface CorrespondenceProps {
  student: Student;
}

export const CorrespondenceList: React.FC<CorrespondenceProps> = ({ student }) => {
  const { defaultBackgroundColor, iconColor } = useColors();
  const [open, setOpen] = useState(false);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedCorrespondence(null);
  };

  const handleEditClick = (index: number) => {
    return () => {
      setSelectedCorrespondence(student.correspondence[index]);
      handleDialogOpen();
    };
  };

  const onSubmit = (data: Correspondence) => {
    if (selectedCorrespondence) {
      const recordIndex = findIndex(student.correspondence, selectedCorrespondence);
      student.correspondence[recordIndex] = data;
    } else {
      student.correspondence.push(data);
    }
    setStudentData(student);
    handleDialogClose();
  };

  return (
    <>
      <LabeledContainer label="Correspondence" parentContainerProps={{ marginBottom: 2 }}>
        <Box marginBottom={1} marginTop={1} width="100%">
          <Button color="secondary" onClick={handleDialogOpen} variant="contained">
            Add Correspondence
          </Button>
        </Box>
        {reverse(
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
                  width: "100%",
                }}
              >
                <Tooltip arrow title="Edit Correspondence">
                  <IconButton
                    onClick={handleEditClick(i)}
                    sx={{
                      color: iconColor,
                      position: "absolute",
                      right: "-3vw",
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
        )}
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
