import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { isEmpty, omit } from "lodash";
import React, { useCallback } from "react";
import useState from "react-usestateref";
import {
  AcademicRecords,
  ActionsMenu,
  CorrespondenceList,
  CustomCard,
  CustomToolbar,
  FinalGradeReportDialog,
  FormDialog,
  Loading,
  PlacementList,
  StudentCardHeader,
  StudentFilter,
  StudentForm,
  StudentInfo,
  VirtualizedList,
} from "../components";
import { StudentCardImage } from "../components/StudentList/StudentCardImage";
import { useAppStore, useFormDialog, usePageState, useStudentStore } from "../hooks";
import { emptyStudent, Status, Student } from "../interfaces";
import {
  deleteImage,
  deleteStudentData,
  removeNullFromObject,
  searchStudents,
  setData,
  setPrimaryNumberBooleanArray,
  sortStudents,
  studentFormSchema,
} from "../services";

export const StudentDatabasePage = () => {
  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const setSelectedStudent = useStudentStore((state) => {
    return state.setSelectedStudent;
  });
  const filter = useStudentStore((state) => {
    return state.filter;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const [openFGRDialog, setOpenFGRDialog] = useState(false);
  const isAdminOrFaculty = role === "admin" || role === "faculty";
  const {
    filteredList: filteredStudents,
    handleSearchStringChange,
    searchString,
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

  const {
    handleDialogClose: handleStudentDialogClose,
    handleDialogOpen: handleStudentDialogOpen,
    openDialog: openStudentDialog,
  } = useFormDialog({ setSelectedData: setSelectedStudent });

  const handleGenerateFGRClick = useCallback(() => {
    setOpenFGRDialog(true);
  }, []);

  const handleFGRDialogClose = useCallback(() => {
    setOpenFGRDialog(false);
  }, []);

  const studentFormOnSubmit = useCallback(
    (data: Student) => {
      const primaryPhone = data.phone.phoneNumbers[data.phone.primaryPhone as number]?.number;
      if (primaryPhone) {
        data.phone.primaryPhone = primaryPhone;
      } else {
        // eslint-disable-next-line no-alert
        alert("You must choose a primary phone number.");
        return;
      }
      if (isEmpty(data.academicRecords) && data.status.currentStatus === Status.NEW) {
        data.academicRecords = [
          {
            level: data.currentLevel,
            session: data.initialSession,
          },
        ];
      }
      if (!data.imageName && selectedStudent?.imageName) {
        deleteImage(selectedStudent, "imageName", true);
      }
      if (!data.covidVaccine.imageName && selectedStudent?.covidVaccine.imageName) {
        deleteImage(selectedStudent, "covidVaccine.imageName", true);
      }
      const dataNoSuspect = data.covidVaccine.suspectedFraud
        ? data
        : omit(data, "covidVaccine.suspectedFraudReason");
      const dataNoNull = removeNullFromObject(dataNoSuspect) as Student;
      setData(dataNoNull, "students", "epId");
      dataNoNull.epId !== selectedStudent?.epId && selectedStudent && deleteStudentData(selectedStudent);
      !selectedStudent && handleSearchStringChange(dataNoNull.epId.toString());
      handleStudentDialogClose();
    },
    [handleSearchStringChange, handleStudentDialogClose, selectedStudent],
  );

  return (
    <>
      <Box position="sticky" top={0} zIndex={5}>
        <CustomToolbar
          filter={filter}
          filterComponent={<StudentFilter />}
          handleSearchStringChange={handleSearchStringChange}
          list={filteredStudents}
          searchString={searchString}
          setShowActions={setShowActions}
          showActions={showActions}
          tooltipObjectName="Students"
        />
        <ActionsMenu
          handleDialogOpen={handleStudentDialogOpen}
          handleGenerateFGRClick={handleGenerateFGRClick}
          showActions={showActions}
          tooltipObjectName="Student"
        />
      </Box>
      <Loading />
      <VirtualizedList defaultSize={600} deps={[role]} idPath="epId" listData={filteredStudents}>
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
      <FormDialog
        dialogProps={{
          fullScreen: true,
          sx: {
            width: "100%",
          },
        }}
        handleDialogClose={handleStudentDialogClose}
        onSubmit={studentFormOnSubmit}
        open={openStudentDialog}
        stickySubmit
        useFormProps={{
          defaultValues: setPrimaryNumberBooleanArray(selectedStudent, "phone.phoneNumbers"),
          resolver: yupResolver(studentFormSchema),
        }}
      >
        <StudentForm />
      </FormDialog>
      <FinalGradeReportDialog handleDialogClose={handleFGRDialogClose} open={openFGRDialog} />
    </>
  );
};
