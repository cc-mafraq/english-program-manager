import { useCallback, useState } from "react";

interface UseFormDialogProps<T> {
  setSelectedData?: (selectedData: T | null) => void;
}

export const useFormDialog = <T extends object>({ setSelectedData }: UseFormDialogProps<T>) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
    setSelectedData && setSelectedData(null);
  }, [setSelectedData]);

  return { handleDialogClose, handleDialogOpen, openDialog };
};
