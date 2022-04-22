import { Box, Button, Dialog, DialogProps, useTheme } from "@mui/material";
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
      <Box sx={{ padding: "10px" }}>
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
