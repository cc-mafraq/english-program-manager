import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { collection } from "firebase/firestore";
import { get, map } from "lodash";
import React, { useCallback, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Loading } from "../components";
import { RoleFormDialog } from "../components/Settings";
import { useAppStore } from "../hooks";
import { WhiteListEntry } from "../interfaces";
import { db, deleteWhiteListEntry } from "../services";

export const SettingsPage = () => {
  const [value, loading] = useCollection(collection(db, "whitelist"));
  const [open, setOpen] = useState(false);
  const [selectedWhiteListEntry, setSelectedWhiteListEntry] = useState<WhiteListEntry | null>();
  const role = useAppStore((state) => {
    return state.role;
  });

  const handleAddRoleClick = useCallback(() => {
    setSelectedWhiteListEntry(null);
    setOpen(true);
  }, []);

  const handleEditRoleClick = useCallback((whiteListEntry: WhiteListEntry) => {
    return () => {
      setSelectedWhiteListEntry(whiteListEntry);
      setOpen(true);
    };
  }, []);

  const handleDeleteRoleClick = useCallback((email: string) => {
    // TODO: Add confirmation popup
    return () => {
      deleteWhiteListEntry(email);
    };
  }, []);

  return (
    <Box>
      <Paper sx={{ width: "100%" }}>
        <Box paddingLeft="10px">
          {role === "admin" && (
            <Box maxWidth="700px">
              <Toolbar>
                <Typography component="div" sx={{ flex: "1 1 100%" }} variant="h6">
                  Roles
                </Typography>
                <Tooltip title="Add Role">
                  <IconButton onClick={handleAddRoleClick}>
                    <Add />
                  </IconButton>
                </Tooltip>
              </Toolbar>
              <Loading loading={loading} />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map(value?.docs, (doc) => {
                    const docRole = get(doc?.data(), "role");
                    return (
                      <TableRow key={doc?.id}>
                        <TableCell>{doc?.id}</TableCell>
                        <TableCell>{docRole}</TableCell>
                        <TableCell>
                          <Tooltip arrow title="Edit Role">
                            <IconButton onClick={handleEditRoleClick({ email: doc?.id, role: docRole })}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip arrow title="Delete Role">
                            <IconButton onClick={handleDeleteRoleClick(doc?.id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Paper>
      <RoleFormDialog open={open} selectedWhiteListEntry={selectedWhiteListEntry} setOpen={setOpen} />
    </Box>
  );
};
