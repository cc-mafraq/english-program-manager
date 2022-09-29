import { set } from "lodash";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "../interfaces";

interface UseFormDialogProps {
  selectedDataPath: string;
}

export const useFormDialog = ({ selectedDataPath }: UseFormDialogProps) => {
  const { appDispatch } = useContext(AppContext);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
    const payload = set({}, selectedDataPath, null);
    appDispatch({ payload });
  }, [appDispatch, selectedDataPath]);

  return { handleDialogClose, handleDialogOpen, openDialog };
};
