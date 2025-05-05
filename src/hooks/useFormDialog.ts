import { DialogProps as MuiDialogProps } from "@mui/material";
import { useCallback, useState } from "react";

interface UseFormDialogProps<T> {
  disableBackdropClick?: boolean;
  setSelectedData?: (selectedData: T | null) => void;
}

export interface DialogProps extends MuiDialogProps {
  onClose: (reason: "backdropClick" | "escapeKeyDown" | "submit") => void;
}

export const useFormDialog = <T extends object>({
  setSelectedData,
  disableBackdropClick,
}: UseFormDialogProps<T>) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleDialogClose = useCallback<DialogProps["onClose"]>(
    (reason) => {
      if (disableBackdropClick && reason === "backdropClick") return;
      setOpenDialog(false);
      setSelectedData && setSelectedData(null);
    },
    [disableBackdropClick, setSelectedData],
  );

  return { handleDialogClose, handleDialogOpen, openDialog };
};
