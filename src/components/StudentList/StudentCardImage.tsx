import { Box } from "@mui/material";
import React, { useContext } from "react";
import { Image, WithdrawButton } from "..";
import { AppContext, Nationality, Status, Student } from "../../interfaces";
import { studentImageFolder } from "../../services";

interface StudentCardImageProps {
  data: Student;
}

export const StudentCardImage: React.FC<StudentCardImageProps> = ({ data: student }) => {
  const {
    appState: { role },
  } = useContext(AppContext);

  return (
    <Box>
      <Image
        folderName={studentImageFolder}
        imagePath="imageName"
        imageStyleProps={{
          maxHeight: "250px",
          width: "175px",
        }}
        innerContainerProps={{ height: "250px" }}
        loadingContainerProps={{
          left: "88px",
          position: "absolute",
          top: "125px",
          transform: "translate(-50%, -50%)",
        }}
        outerContainerProps={{
          minWidth: "175px",
          sx: {
            border: "solid",
            borderColor: student.nationality === Nationality.JDN ? "rgb(0,176,80)" : "rgb(204,102,0)",
            borderWidth:
              (student.nationality === Nationality.JDN || student.nationality === Nationality.SYR) &&
              role === "admin"
                ? 2
                : 0,
            height: "250px",
          },
        }}
        scale={2}
        student={student}
      />
      {student.status.currentStatus !== Status.WD && role === "admin" && <WithdrawButton student={student} />}
    </Box>
  );
};
