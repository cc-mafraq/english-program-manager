import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogProps, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import React, { CSSProperties, PropsWithChildren, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm, UseFormProps } from "react-hook-form";
import { useColors } from "../../hooks";
import { SPACING } from "../../services";

interface FormDialogProps<T> {
  dialogProps?: Partial<DialogProps>;
  handleDialogClose: () => void;
  onSubmit: SubmitHandler<T>;
  open: boolean;
  paperStyleProps?: CSSProperties;
  useFormProps: UseFormProps<T>;
}

export const FormDialog = <T,>({
  open,
  handleDialogClose,
  onSubmit,
  useFormProps,
  dialogProps,
  paperStyleProps,
  children,
}: PropsWithChildren<FormDialogProps<T>>) => {
  const { popoverColor } = useColors();
  const theme = useTheme();
  const methods = useForm<T>({ criteriaMode: "all", ...useFormProps });

  useEffect(() => {
    methods.reset(useFormProps.defaultValues);
  }, [methods, useFormProps]);

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
        <FormProvider {...methods}>
          <form>
            {children}
            <Button
              className="update-button"
              onClick={methods.handleSubmit(onSubmit)}
              sx={{
                "&:hover": {
                  backgroundColor: green[900],
                },
                backgroundColor: green[800],
                color: theme.palette.mode === "light" ? "white" : grey[200],
                marginTop: SPACING,
              }}
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
            <Grid item>
              <Typography variant="caption">
                Tip: use <b>tab</b> and <b>shift + tab</b> to navigate, <b>space bar</b> to select checkboxes,{" "}
                <b>arrow keys</b> to select radio buttons, and <b>return</b> to submit and click buttons.
              </Typography>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Dialog>
  );
};

FormDialog.defaultProps = {
  dialogProps: undefined,
  paperStyleProps: undefined,
};
