import { Box, Typography } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { LabeledContainer } from ".";
import { Student } from "../../interfaces";
import { defaultBackgroundColor, defaultBorderColor } from "../../services";

interface CorrespondenceProps {
  student: Student;
}

export const Correspondence: React.FC<CorrespondenceProps> = ({ student }) => {
  return (
    <LabeledContainer label="Correspondence" parentContainerProps={{ marginBottom: 2 }}>
      {map(student.correspondence, (c) => {
        return (
          <Box
            key={`${c.date} ${c.notes}`}
            sx={{
              backgroundColor: defaultBackgroundColor,
              border: 1,
              borderColor: defaultBorderColor,
              marginRight: 1,
              marginTop: 1,
              padding: 1,
            }}
          >
            <Typography fontSize="11pt" variant="body2">
              {c.date ? `${c.date}: ${c.notes}` : c.notes}
            </Typography>
          </Box>
        );
      })}
    </LabeledContainer>
  );
};
