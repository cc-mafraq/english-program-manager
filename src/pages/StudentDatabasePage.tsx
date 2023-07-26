import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { filter as _filter, isArray, isEmpty } from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import {
  FinalGradeReportDialog,
  Loading,
  MenuBar,
  StudentDatabaseToolbar,
  StudentFormDialog,
  StudentList,
} from "../components";
import { usePageState, useStudentFormStore, useStudentStore } from "../hooks";
import { Student } from "../interfaces";
import { searchStudents, sortStudents } from "../services";

export const StudentDatabasePage = () => {
  const filter = useStudentStore((state) => {
    return state.filter;
  });
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const setStudentDialogOpen = useStudentFormStore((state) => {
    return state.setOpen;
  });

  const menuRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const handleStudentDialogOpen = useCallback(() => {
    setStudentDialogOpen(true);
  }, [setStudentDialogOpen]);

  const {
    filteredList: filteredStudents,
    handleSearchStringChange,
    searchString,
  } = usePageState<Student>({
    collectionName: "students",
    filter,
    requiredValuePath: "name.english",
    searchFn: searchStudents,
    setData: setStudents,
    sortFn: sortStudents,
  });

  const shouldEmpty = useMemo(() => {
    return isEmpty(searchString) && isEmpty(filter);
  }, [filter, searchString]);

  return (
    <>
      <MenuBar innerRef={menuRef} pageName="Student Database" />
      <StudentDatabaseToolbar
        filteredStudents={shouldEmpty ? [] : filteredStudents}
        handleSearchStringChange={handleSearchStringChange}
        handleStudentDialogOpen={handleStudentDialogOpen}
        searchString={searchString}
      />
      {shouldEmpty && (
        <Box color="white" position="relative" textAlign="center">
          <Box
            sx={{
              fontVariant: "small-caps",
              left: "50%",
              position: "absolute",
              textShadow: "1.5px 1.5px #000000",
              top: "20vh",
              transform: "translate(-50%, -50%)",
              width: "100%",
            }}
          >
            <Typography letterSpacing="0.5vw" variant="h3">
              Welcome to the CCM Student Database!
            </Typography>
            <Typography letterSpacing="0.5vw" marginTop="1vh" variant="h3">
              <SearchOutlined
                fontSize="large"
                sx={{
                  color: theme.palette.primary.main,
                  filter: "drop-shadow(0.75px 0.75px #000000)",
                  marginRight: "10px",
                  marginTop: "20px",
                }}
              />
              search or{" "}
              <FilterListOutlined
                fontSize="large"
                sx={{
                  color: theme.palette.primary.main,
                  filter: "drop-shadow(0.75px 0.75px #000000)",
                  marginRight: "10px",
                  marginTop: "5px",
                }}
              />
              filter to get started.
            </Typography>
          </Box>
          <img
            alt="Mafraq Art"
            src={
              theme.palette.mode === "dark" ? "./assets/mafraq-art-wide-dark.jpg" : "./assets/mafraq-art-wide.jpg"
            }
            width="100%"
          />
        </Box>
      )}
      <Loading />
      <StudentList
        filteredStudents={_filter(shouldEmpty ? [] : filteredStudents, (student) => {
          return isArray(student.placement);
        })}
        handleStudentDialogOpen={handleStudentDialogOpen}
        menuRef={menuRef}
      />
      <StudentFormDialog handleSearchStringChange={handleSearchStringChange} />
      <FinalGradeReportDialog />
    </>
  );
};
