import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { Image, WithdrawButton } from "..";
import { AppContext, Nationality, Status, Student } from "../../interfaces";
import { studentImageFolder } from "../../services";

interface StudentCardImageProps {
  data: Student;
  imageWidth: number;
  smallBreakpointScaleDown: number;
}

export const StudentCardImage: React.FC<StudentCardImageProps> = ({
  data: student,
  imageWidth,
  smallBreakpointScaleDown,
}) => {
  const {
    appState: { role },
  } = useContext(AppContext);
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const maxImageHeight = 250;

  return (
    <Box>
      <Image
        folderName={studentImageFolder}
        imagePath="imageName"
        imageStyleProps={{
          maxHeight: greaterThanSmall ? `${maxImageHeight}px` : `${maxImageHeight / smallBreakpointScaleDown}px`,
          width: greaterThanSmall ? `${imageWidth}px` : `${imageWidth / smallBreakpointScaleDown}px`,
        }}
        innerContainerProps={{
          height: greaterThanSmall ? `${maxImageHeight}px` : `${maxImageHeight / smallBreakpointScaleDown}px`,
        }}
        loadingContainerProps={{
          left: greaterThanSmall ? `${imageWidth / 2}px` : `${imageWidth / (2 * smallBreakpointScaleDown)}px`,
          position: "absolute",
          top: greaterThanSmall
            ? `${maxImageHeight / 2}px`
            : `${maxImageHeight / (2 * smallBreakpointScaleDown)}px`,
          transform: "translate(-30%, -30%)",
        }}
        outerContainerProps={{
          sx: {
            border: "solid",
            borderColor: student.nationality === Nationality.JDN ? "rgb(0,176,80)" : "rgb(204,102,0)",
            borderWidth:
              (student.nationality === Nationality.JDN || student.nationality === Nationality.SYR) &&
              role === "admin"
                ? 2
                : 0,
            height: greaterThanSmall ? `${maxImageHeight}px` : `${maxImageHeight / smallBreakpointScaleDown}px`,
            minWidth: greaterThanSmall ? `${imageWidth}px` : `${imageWidth / smallBreakpointScaleDown}px`,
          },
        }}
        scale={greaterThanSmall ? 2 : 1.5}
        student={student}
      />
      {student.status.currentStatus !== Status.WD && role === "admin" && <WithdrawButton student={student} />}
    </Box>
  );
};
