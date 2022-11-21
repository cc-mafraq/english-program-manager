import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
  AcademicRecords,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
  FinalGradeReportDialog,
  Loading,
  PlacementList,
  StudentCardHeader,
  StudentDatabaseActions,
  StudentFilter,
  StudentFormDialog,
  StudentInfo,
  VirtualizedList,
} from "../components";
import { StudentCardImage } from "../components/StudentList/StudentCardImage";
import {
  useAppStore,
  useFinalGradeReportStore,
  usePageState,
  useStudentFormStore,
  useStudentStore,
} from "../hooks";
import { emptyStudent, Student } from "../interfaces";
import { searchStudents, sortStudents } from "../services";

export const StudentDatabasePage = () => {
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const filter = useStudentStore((state) => {
    return state.filter;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const setStudentDialogOpen = useStudentFormStore((state) => {
    return state.setOpen;
  });
  const setFGRDialogOpen = useFinalGradeReportStore((state) => {
    return state.setOpen;
  });

  const handleStudentDialogOpen = useCallback(() => {
    setStudentDialogOpen(true);
  }, [setStudentDialogOpen]);

  const handleFGRDialogOpen = useCallback(() => {
    setFGRDialogOpen(true);
  }, [setFGRDialogOpen]);

  const isAdminOrFaculty = role === "admin" || role === "faculty";
  const {
    filteredList: filteredStudents,
    handleSearchStringChange,
    setShowActions,
    showActions,
  } = usePageState<Student>({
    collectionName: "students",
    filter,
    payloadPath: "students",
    requiredValuePath: "name.english",
    searchFn: searchStudents,
    setData: setStudents,
    sortFn: sortStudents,
  });

  return (
    <>
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          filter={filter}
          filterComponent={<StudentFilter />}
          handleDialogOpen={handleStudentDialogOpen}
          handleSearchStringChange={handleSearchStringChange}
          list={filteredStudents}
          otherActions={
            <StudentDatabaseActions
              handleDialogOpen={handleStudentDialogOpen}
              handleGenerateFGRClick={handleFGRDialogOpen}
            />
          }
          setShowActions={setShowActions}
          showActions={showActions}
          tooltipObjectName="Students"
        />
      </Box>
      <Loading />
      <VirtualizedList defaultSize={600} idPath="epId" listData={filteredStudents}>
        <CustomCard
          data={emptyStudent}
          header={<StudentCardHeader data={emptyStudent} handleEditStudentClick={handleStudentDialogOpen} />}
          image={<StudentCardImage data={emptyStudent} imageWidth={175} smallBreakpointScaleDown={1.5} />}
          noTabs={role !== "admin" && role !== "faculty"}
          tabContents={[
            { component: <StudentInfo data={emptyStudent} />, label: "Student Information" },
            {
              component: <CorrespondenceList collectionName="students" data={emptyStudent} idPath="epId" />,
              hidden: role !== "admin",
              label: "Correspondence",
            },
            {
              component: <AcademicRecords data={emptyStudent} />,
              hidden: !isAdminOrFaculty,
              label: "Academic Records",
            },
            { component: <PlacementList data={emptyStudent} />, hidden: !isAdminOrFaculty, label: "Placement" },
          ]}
        />
      </VirtualizedList>
      <StudentFormDialog handleSearchStringChange={handleSearchStringChange} />
      <FinalGradeReportDialog />
    </>
  );
};
