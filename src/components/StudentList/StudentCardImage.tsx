import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { Image, StudentIdCardButton, WithdrawButton } from "..";
import { useAppStore } from "../../hooks";
import { Nationality, Status, Student } from "../../interfaces";
import { studentImageFolder } from "../../services";

interface StudentCardImageProps {
  data: Student;
  imageWidth: number;
  noBorder?: boolean;
  noButtons?: boolean;
  smallBreakpointScaleDown: number;
}

export const StudentCardImage: React.FC<StudentCardImageProps> = ({
  data: student,
  imageWidth,
  smallBreakpointScaleDown,
  noButtons,
  noBorder,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const greaterThanMedium = useMediaQuery(theme.breakpoints.up("md"));
  const maxImageHeight = (imageWidth * 10) / 7;

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
          transform: "translate(-50%, -50%)",
        }}
        outerContainerProps={{
          sx: {
            border: noBorder ? "" : "solid",
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
      {!noButtons && (
        <Box display="flex" flexDirection="row" justifyContent="space-evenly" marginBottom="20px" marginTop="30px">
          {student.status.currentStatus !== Status.WD && role === "admin" && greaterThanSmall && (
            <WithdrawButton student={student} />
          )}
          {student.imageName && greaterThanMedium && role === "admin" && <StudentIdCardButton student={student} />}
        </Box>
      )}
    </Box>
  );
};

StudentCardImage.defaultProps = {
  noBorder: undefined,
  noButtons: undefined,
};
