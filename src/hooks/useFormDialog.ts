import { get, startCase } from "lodash";
import { useCallback, useContext, useState } from "react";
import { useStore } from "zustand";
import { AppContext } from "../App";

interface UseFormDialogProps {
  selectedDataPath?: string;
}

export const useFormDialog = ({ selectedDataPath }: UseFormDialogProps) => {
  const store = useContext(AppContext);
  const setSelectedData = useStore(store, (state) => {
    return get(state, `set${startCase(selectedDataPath)}`.replace(/ /g, ""));
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
    if (selectedDataPath) {
      setSelectedData(null);
    }
  }, [selectedDataPath, setSelectedData]);

  return { handleDialogClose, handleDialogOpen, openDialog };
};
