import { Close } from "@mui/icons-material";
import { Box, Dialog, DialogProps, IconButton, ListItem, Tooltip, Typography } from "@mui/material";
import { map } from "lodash";
import React, { CSSProperties } from "react";
import { useFormContext } from "react-hook-form";
import { useColors } from "../../hooks";
import { getListOfErrors } from "../../services";

interface FormErrorDialogProps {
  dialogProps?: Partial<DialogProps>;
  handleDialogClose: () => void;
  open: boolean;
  paperStyleProps?: CSSProperties;
}

export const FormErrorDialog: React.FC<FormErrorDialogProps> = ({
  open,
  handleDialogClose,
  dialogProps,
  paperStyleProps,
}) => {
  const { popoverColor } = useColors();
  const { formState } = useFormContext();

  return (
    <Dialog
      fullWidth
      onClose={handleDialogClose}
      open={open}
      PaperProps={{
        style: {
          backgroundColor: popoverColor,
          overflowX: "hidden",
          ...paperStyleProps,
        },
      }}
      {...dialogProps}
    >
      <Box sx={{ padding: "10px", position: "relative" }}>
        <Tooltip arrow title="Close Dialog">
          <IconButton onClick={handleDialogClose} sx={{ position: "absolute", right: "1.5vh", top: "1.5vh" }}>
            <Close />
          </IconButton>
        </Tooltip>
        <Typography>The form has the following errors:</Typography>
        <Box marginLeft={2}>
          {map(getListOfErrors(formState.errors), (e, i) => {
            return (
              <ListItem key={`${e}-${i}`} sx={{ display: "list-item" }}>
                {e}
              </ListItem>
            );
          })}
        </Box>
      </Box>
    </Dialog>
  );
};

FormErrorDialog.defaultProps = {
  dialogProps: undefined,
  paperStyleProps: undefined,
};
