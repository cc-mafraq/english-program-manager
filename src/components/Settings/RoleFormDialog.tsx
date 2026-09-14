import { yupResolver } from "@hookform/resolvers/yup";
import { Breakpoint, FormLabel } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { Roles, WhiteListEntry } from "../../interfaces";
import { deleteWhiteListEntry, setData, whiteListEntrySchema } from "../../services";
import { FormDialog, GridContainer, GridItemAutocomplete, GridItemTextField } from "../reusables";

interface RoleFormDialogProps {
  open: boolean;
  selectedWhiteListEntry?: WhiteListEntry | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RoleFormDialog: React.FC<RoleFormDialogProps> = ({ open, setOpen, selectedWhiteListEntry }) => {
  const onSubmit = useCallback(
    (data: WhiteListEntry) => {
      if (selectedWhiteListEntry && selectedWhiteListEntry?.email !== data?.email) {
        deleteWhiteListEntry(selectedWhiteListEntry.email);
      }
      setData(data, "whitelist", "email");
      setOpen(false);
    },
    [selectedWhiteListEntry, setOpen],
  );

  const dialogProps = useMemo(() => {
    const breakpoint: Breakpoint = "lg";
    return { maxWidth: breakpoint };
  }, []);

  const useFormProps = useMemo(() => {
    return {
      defaultValues: selectedWhiteListEntry ?? {},
      resolver: yupResolver(whiteListEntrySchema),
    };
  }, [selectedWhiteListEntry]);

  return (
    <FormDialog<WhiteListEntry>
      dialogProps={{ ...dialogProps, fullWidth: false }}
      handleDialogClose={() => {
        setOpen(false);
      }}
      onSubmit={onSubmit}
      open={open}
      useFormProps={useFormProps}
    >
      <FormLabel>Role</FormLabel>
      <GridContainer>
        <GridItemTextField label="Email" name="email" />
        <GridItemAutocomplete label="Role" name="role" options={Object.values(Roles)} />
      </GridContainer>
    </FormDialog>
  );
};
