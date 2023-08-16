import React from "react";
import { AcademicRecords, PlacementList, StudentCardHeader, StudentCardImage, StudentInfo } from "..";
import { useAppStore } from "../../hooks";
import { Student, emptyStudent } from "../../interfaces";
import { CorrespondenceList, CustomCard } from "../reusables";

interface StudentCardProps {
  handleStudentDialogOpen: () => void;
}

const StudentInfoMemo: React.FC<{ data: Student }> = React.memo(({ data }) => {
  return <StudentInfo data={data} />;
});
StudentInfoMemo.displayName = "Student Info";

export const StudentCard: React.FC<StudentCardProps> = (props) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const isAdminOrFaculty = role === "admin" || role === "faculty";
  const { handleStudentDialogOpen } = props;

  return (
    <CustomCard
      data={emptyStudent}
      header={<StudentCardHeader data={emptyStudent} handleEditStudentClick={handleStudentDialogOpen} />}
      image={<StudentCardImage data={emptyStudent} imageWidth={150} smallBreakpointScaleDown={1.5} />}
      noTabs={role !== "admin" && role !== "faculty"}
      tabContents={[
        {
          component: <StudentInfoMemo data={emptyStudent} />,
          label: "Student Information",
        },
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
      {...props}
    />
  );
};
