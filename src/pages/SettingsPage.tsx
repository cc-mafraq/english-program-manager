import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { collection } from "firebase/firestore";
import { get, map } from "lodash";
import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Loading } from "../components";
import { useAppStore } from "../hooks";
import { db } from "../services";

export const SettingsPage = () => {
  const [value, loading] = useCollection(collection(db, "whitelist"));
  const role = useAppStore((state) => {
    return state.role;
  });
  return (
    <Paper sx={{ width: "100%" }}>
      <Box margin="10px">
        {role === "admin" && (
          <Box maxWidth="500px">
            <Toolbar>
              <Typography component="div" variant="h6">
                Roles
              </Typography>
            </Toolbar>
            <Loading loading={loading} />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map(value?.docs, (doc) => {
                  return (
                    <TableRow key={doc?.id}>
                      <TableCell>{doc?.id}</TableCell>
                      <TableCell>{get(doc?.data(), "role")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
