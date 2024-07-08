import { Box, BoxProps, useMediaQuery, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";
import { Image, StudentIdCardButton, WithdrawButton } from "..";
import { useAppStore } from "../../hooks";
import { Nationality, Status, Student } from "../../interfaces";
import { studentImageFolder } from "../../services";

interface StudentCardImageProps {
  data: Student;
  imageContainerProps?: BoxProps;
  imageWidth: number;
  loadingIconSize?: string;
  noBorder?: boolean;
  noButtons?: boolean;
  noMinWidth?: boolean;
  smallBreakpointScaleDown: number;
}

export const StudentCardImage: React.FC<StudentCardImageProps> = ({
  data: student,
  imageWidth,
  smallBreakpointScaleDown,
  noButtons,
  noBorder,
  imageContainerProps,
  loadingIconSize,
  noMinWidth,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const greaterThanMedium = useMediaQuery(theme.breakpoints.up("md"));
  const maxImageHeight = (imageWidth * 10) / 7;
  const withdrawButtonConditions =
    student.status?.currentStatus !== undefined &&
    student.status?.currentStatus !== Status.WD &&
    role === "admin" &&
    greaterThanSmall &&
    import.meta.env.VITE_PROJECT_NAME === "ccm-english";
  const studentIdCardButtonConditions = student.imageName && greaterThanMedium && role === "admin";

  return (
    <Box {...imageContainerProps}>
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
        loadingIconSize={loadingIconSize}
        noButton={noButtons}
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
            minWidth:
              noMinWidth && isEmpty(student.imageName)
                ? 0
                : greaterThanSmall
                ? `${imageWidth}px`
                : `${imageWidth / smallBreakpointScaleDown}px`,
          },
        }}
        scale={greaterThanSmall ? 2 : 1.5}
        student={student}
      />
      {!noButtons && (withdrawButtonConditions || studentIdCardButtonConditions) && (
        <Box display="flex" flexDirection="row" justifyContent="space-evenly" marginBottom="20px" marginTop="30px">
          {withdrawButtonConditions && <WithdrawButton student={student} />}
          {studentIdCardButtonConditions && <StudentIdCardButton student={student} />}
        </Box>
      )}
    </Box>
  );
};

StudentCardImage.defaultProps = {
  imageContainerProps: undefined,
  loadingIconSize: undefined,
  noBorder: undefined,
  noButtons: undefined,
  noMinWidth: undefined,
};
