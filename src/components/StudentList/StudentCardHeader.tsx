import { Edit, WhatsApp } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";
import { useAppStore, useColors, useStudentStore } from "../../hooks";
import { Student } from "../../interfaces";
import { isValidPhoneNumber } from "../../services";

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
  const phoneNumberIsValid = isValidPhoneNumber(student.phone.primaryPhone as number);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "column", paddingBottom: 1 }}>
          <Typography variant="h5">{student.name.english}</Typography>
          <Typography variant="h5">{student.name.arabic === "N/A" ? "" : student.name.arabic}</Typography>
        </Box>
        <Box>
          <Box>
            {phoneNumberIsValid ? (
              <Tooltip enterDelay={500} placement="top" title="Primary WhatsApp Number">
                <Typography marginRight="5px" variant="h5">
                  {student.phone.primaryPhone}
                </Typography>
              </Tooltip>
            ) : (
              <Typography marginRight="5px" variant="h5">
                WA Number Invalid
              </Typography>
            )}
            <Tooltip enterDelay={500} title="English Program ID Number">
              <Typography
                color={theme.palette.mode === "light" ? theme.palette.secondary.main : theme.palette.primary.light}
                variant="h6"
              >
                {student.epId ? student.epId : "Invalid"}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
        <Box>
          <Box>
            {phoneNumberIsValid && (
              <Tooltip arrow title="Contact on WhatsApp">
                <IconButton href={`https://wa.me/962${student.phone.primaryPhone}`} target="_blank">
                  <WhatsApp sx={{ color: iconColor }} />
                </IconButton>
              </Tooltip>
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
        </Box>
      </Box>
      <Divider />
    </>
  );
};
