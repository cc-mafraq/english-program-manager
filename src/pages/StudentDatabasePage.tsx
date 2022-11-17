import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { isEmpty, omit } from "lodash";
import React, { useCallback, useContext } from "react";
import useState from "react-usestateref";
import { useStore } from "zustand";
import { AppContext } from "../App";
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
import { useFormDialog, usePageState } from "../hooks";
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
  const store = useContext(AppContext);
  const selectedStudent = useStore(store, (state) => {
    return state.selectedStudent;
  });
  const role = useStore(store, (state) => {
    return state.role;
  });
  const filter = useStore(store, (state) => {
    return state.studentFilter;
  });
  const [openFGRDialog, setOpenFGRDialog] = useState(false);
  // const [spreadsheetIsLoading, setSpreadsheetIsLoading] = useState(false);
  const isAdminOrFaculty = role === "admin" || role === "faculty";
  const {
    filteredList: filteredStudents,
    handleSearchStringChange,
    searchString,
    setShowActions,
    showActions,
    listPage: studentsPage,
  } = usePageState({
    collectionName: "students",
    conditionToAddPath: "name.english",
    filter,
    payloadPath: "students",
    searchFn: searchStudents,
    sortFn: sortStudents,
    // spreadsheetIsLoading,
  });

  const {
    handleDialogClose: handleStudentDialogClose,
    handleDialogOpen: handleStudentDialogOpen,
    openDialog: openStudentDialog,
  } = useFormDialog({ selectedDataPath: "selectedStudent" });

  // const onInputChange = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     setSpreadsheetIsLoading(true);
  //     const file: File | null = e.target.files && e.target.files[0];
  //     const reader = new FileReader();

  //     file && appDispatch({ payload: { loading: true } });
  //     file && reader.readAsText(file);

  //     reader.onloadend = async () => {
  //       const studentListString = String(reader.result);
  //       await spreadsheetToStudentList(studentListString, students);
  //       appDispatch({ payload: { loading: false } });
  //       setSpreadsheetIsLoading(false);
  //     };
  //   },
  //   [appDispatch, students],
  // );

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
          filterComponent={<StudentFilter />}
          filterName="studentFilter"
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
          // onInputChange={onInputChange}
          showActions={showActions}
          tooltipObjectName="Student"
        />
      </Box>
      {openFGRDialog ? (
        <FinalGradeReportDialog handleDialogClose={handleFGRDialogClose} open={openFGRDialog} />
      ) : (
        <></>
      )}
      <Loading />
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
      <VirtualizedList defaultSize={600} deps={[role]} idPath="epId" page={studentsPage}>
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
    </>
  );
};
