import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { Student } from "../../interfaces";

interface StudentCardHeaderProps {
  handleEditStudentClick: () => void;
  setSelectedStudent: Dispatch<SetStateAction<Student | undefined>>;
  student: Student;
}

export const StudentCardHeader: React.FC<StudentCardHeaderProps> = ({
  student,
  handleEditStudentClick,
  setSelectedStudent,
}) => {
  const theme = useTheme();
  return (
    <>
      <Typography component="div" display="inline" fontSize={28} gutterBottom>
        {student.name.english} {student.name.arabic}
      </Typography>
      <Box sx={{ flexDirection: "row", flexGrow: 1, float: "right" }}>
        {student.phone.primaryPhone > 700000000 ? (
          <>
            <Typography display="inline" marginRight="5px" variant="h5">
              {student.phone.primaryPhone}
            </Typography>
            <IconButton href={`https://wa.me/962${student.phone.primaryPhone}`} target="_blank">
              <WhatsAppIcon />
            </IconButton>
          </>
        ) : (
          <Typography display="inline" marginRight="5px" variant="h5">
            WA Number Invalid
          </Typography>
        )}
        <IconButton
          onClick={() => {
            setSelectedStudent(student);
            handleEditStudentClick();
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      <Box paddingBottom={1}>
        <Typography color={theme.palette.secondary.main} variant="h6">
          {student.epId ? student.epId : "Invalid"}
        </Typography>
      </Box>
      <Divider />
    </>
  );
};
