import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
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
            <IconButton href={`https://wa.me/962${student.phone.primaryPhone}`} target="_blank">
              <WhatsAppIcon sx={{ color: iconColor }} />
            </IconButton>
          </>
        ) : (
          <Typography display="inline" marginRight="5px" variant="h5">
            WA Number Invalid
          </Typography>
        )}
        <IconButton
          onClick={() => {
            appDispatch({ payload: { selectedStudent: student }, type: "set" });
            handleEditStudentClick();
          }}
        >
          <EditIcon sx={{ color: iconColor }} />
        </IconButton>
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
