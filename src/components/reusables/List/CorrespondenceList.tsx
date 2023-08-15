import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import { Box, Breakpoint, Button, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { findIndex, get, map, reverse, set } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { FormDialog, FormLabel, LabeledContainer } from "..";
import { useColors } from "../../../hooks";
import { Correspondence } from "../../../interfaces";
import { MOMENT_FORMAT, correspondenceSchema, setData } from "../../../services";
import { FormCorrespondenceItem } from "../../StudentForm";

interface CorrespondenceProps<T extends object> {
  collectionName: string;
  correspondencePath?: string;
  data: T;
  idPath: string;
  itemName?: string;
}

const FormCorrespondenceMemo = React.memo(() => {
  return (
    <>
      <FormLabel>Correspondence</FormLabel>
      <FormCorrespondenceItem />
    </>
  );
});
FormCorrespondenceMemo.displayName = "Correspondence Form";

export const CorrespondenceList = <T extends object>({
  data,
  collectionName,
  idPath,
  correspondencePath,
  itemName: sectionName,
}: CorrespondenceProps<T>) => {
  const { defaultBackgroundColor, defaultBorderColor, iconColor } = useColors();
  const [open, setOpen] = useState(false);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const correspondence = get(data, correspondencePath ?? "correspondence") as unknown as Correspondence[];
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

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
        correspondence
          ? correspondence.push(newCorrespondence)
          : set(data, correspondencePath ?? "correspondence", [newCorrespondence]);
      }
      setData(data as T, collectionName, idPath);
      handleDialogClose();
    },
    [collectionName, correspondence, correspondencePath, data, handleDialogClose, idPath, selectedCorrespondence],
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
  }, [correspondence, defaultBackgroundColor, defaultBorderColor, handleEditClick, iconColor]);

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { maxWidth: breakpoint };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: selectedCorrespondence || {
        date: moment().format(MOMENT_FORMAT),
        notes: "",
      },
      resolver: yupResolver(correspondenceSchema),
    };
  }, [selectedCorrespondence]);

  return (
    <Box display={greaterThanSmall ? "flex" : undefined}>
      <LabeledContainer label="" parentContainerProps={{ marginBottom: 2 }}>
        <Box marginBottom={1} marginTop={1} width="100%">
          <Button color="secondary" onClick={handleDialogOpen} variant="contained">
            Add {sectionName ?? "Correspondence"}
          </Button>
        </Box>
        {CorrespondenceData}
      </LabeledContainer>
      <FormDialog<Correspondence>
        dialogProps={dialogProps}
        handleDialogClose={handleDialogClose}
        onSubmit={onSubmit}
        open={open}
        useFormProps={useFormProps}
      >
        <FormCorrespondenceMemo />
      </FormDialog>
    </Box>
  );
};

CorrespondenceList.defaultProps = {
  correspondencePath: undefined,
  itemName: undefined,
};
