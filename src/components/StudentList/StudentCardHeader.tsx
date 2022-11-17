import { Edit, WhatsApp } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";
import { useAppStore, useColors, useStudentStore } from "../../hooks";
import { Student } from "../../interfaces";

interface StudentCardHeaderProps {
  data: Student;
  handleEditStudentClick: () => void;
}

export const StudentCardHeader: React.FC<StudentCardHeaderProps> = ({ data: student, handleEditStudentClick }) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const setSelectedStudent = useStudentStore((state) => {
    return state.setSelectedStudent;
  });

  const theme = useTheme();
  const { iconColor } = useColors();

  return (
    <>
      <Typography display="inline" variant="h5">
        {student.name.english} {student.name.arabic === "N/A" ? "" : student.name.arabic}
      </Typography>
      <Box sx={{ flexDirection: "row", flexGrow: 1, float: "right" }}>
        {student.phone.primaryPhone > 700000000 ? (
          <>
            <Typography display="inline-flex" marginRight="5px" variant="h5">
              {student.phone.primaryPhone}
            </Typography>
            <Tooltip arrow title="Contact on WhatsApp">
              <IconButton href={`https://wa.me/962${student.phone.primaryPhone}`} target="_blank">
                <WhatsApp sx={{ color: iconColor }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Typography display="inline" marginRight="5px" variant="h5">
            WA Number Invalid
          </Typography>
        )}
        {role === "admin" && (
          <Tooltip arrow title="Edit Student">
            <IconButton
              onClick={() => {
                setSelectedStudent(student);
                handleEditStudentClick();
              }}
            >
              <Edit sx={{ color: iconColor }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box paddingBottom={1}>
        <Typography
          color={theme.palette.mode === "light" ? theme.palette.secondary.main : theme.palette.primary.light}
          variant="h6"
        >
          {student.epId ? student.epId : "Invalid"}
        </Typography>
      </Box>
      <Divider />
    </>
  );
};
