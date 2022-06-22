import { Edit, WhatsApp } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { useColors } from "../../hooks";
import { AppContext, Student } from "../../interfaces";

interface StudentCardHeaderProps {
  handleEditStudentClick: () => void;
  student: Student;
}

export const StudentCardHeader: React.FC<StudentCardHeaderProps> = ({ student, handleEditStudentClick }) => {
  const { appDispatch } = useContext(AppContext);

  const theme = useTheme();
  const { iconColor } = useColors();

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
        <Tooltip arrow title="Edit Student">
          <IconButton
            onClick={() => {
              appDispatch({ payload: { selectedStudent: student } });
              handleEditStudentClick();
            }}
          >
            <Edit sx={{ color: iconColor }} />
          </IconButton>
        </Tooltip>
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
