import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { findIndex, get, map, reverse, set } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { FormDialog, LabeledContainer } from "..";
import { useColors } from "../../../hooks";
import { Correspondence, defaultBorderColor, Student } from "../../../interfaces";
import { correspondenceSchema, MOMENT_FORMAT, setData } from "../../../services";
import { FormCorrespondenceItem, StudentFormLabel } from "../../StudentForm";

interface CorrespondenceProps<T extends object> {
  data: T;
}

export const CorrespondenceList = <T extends object>({ data }: CorrespondenceProps<T>) => {
  const { defaultBackgroundColor, iconColor } = useColors();
  const [open, setOpen] = useState(false);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const correspondence = get(data, "correspondence");

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
        setSelectedCorrespondence(correspondence[index]);
        handleDialogOpen();
      };
    },
    [correspondence, handleDialogOpen],
  );

  const onSubmit = useCallback(
    (newCorrespondence: Correspondence) => {
      if (selectedCorrespondence) {
        const recordIndex = findIndex(correspondence, selectedCorrespondence);
        correspondence[recordIndex] = newCorrespondence;
      } else {
        correspondence ? correspondence.push(newCorrespondence) : set(data, "correspondence", [newCorrespondence]);
      }
      // TODO: make generic
      setData(data as Student, "students", "epId");
      handleDialogClose();
    },
    [correspondence, data, handleDialogClose, selectedCorrespondence],
  );

  const CorrespondenceData = useMemo(() => {
    return reverse(
      map(correspondence, (c, i) => {
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
                onClick={handleEditClick(Number(i))}
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
  }, [correspondence, defaultBackgroundColor, handleEditClick, iconColor]);

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
