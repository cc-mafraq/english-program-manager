import { Badge, Download } from "@mui/icons-material";
import { Box, Dialog, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import download from "downloadjs";
import { toPng } from "html-to-image";
import React, { useCallback, useRef, useState } from "react";
import { Student } from "../../interfaces";

interface StudentIdCardButtonProps {
  student: Student;
}

export const StudentIdCardButton: React.FC<StudentIdCardButtonProps> = ({ student }) => {
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const shortEnglishName = student.name.english.split(" ").slice(0, 2).join(" ");

  const downloadFGR = useCallback(async () => {
    if (cardRef.current) {
      const imgData = await toPng(cardRef.current, {
        canvasHeight: 180,
        canvasWidth: 320,
        skipAutoScale: true,
      });
      return imgData;
    }
    return null;
  }, []);

  const handleDownload = useCallback(async () => {
    const imgData = await downloadFGR();
    if (!imgData) return;
    await download(imgData, `${student.epId}.jpeg`);
  }, [downloadFGR, student.epId]);

  return (
    <Box>
      <Tooltip arrow title="Student ID Card">
        <IconButton onClick={handleDialogOpen} sx={greaterThanSmall ? { transform: "scale(1.25)" } : undefined}>
          <Badge />
        </IconButton>
      </Tooltip>
      <Dialog onClose={handleDialogClose} open={open} PaperProps={{ style: { backgroundColor: "#ffffff" } }}>
        <Box sx={{ justifyContent: "center" }}>
          <Tooltip arrow title="Download ID Card">
            <IconButton color={theme.palette.mode === "dark" ? "secondary" : "primary"} onClick={handleDownload}>
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
        <div ref={cardRef}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderColor: "#000000",
              borderStyle: "solid",
              borderWidth: 1.5,
              height: "180px",
              margin: "5px",
              padding: "18px",
              width: "320px",
            }}
          >
            <Box display="flex" flexDirection="row">
              <Box
                sx={{
                  alignItems: "center",
                  borderColor: "#000000",
                  borderStyle: "solid",
                  borderWidth: 1.5,
                  height: "115px",
                  width: "140px",
                }}
              >
                <img
                  alt={`${student.name.english}`}
                  height="115px"
                  src={student.imageName}
                  style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                />
              </Box>
              <Box sx={{ marginLeft: "10px", textAlign: "center" }}>
                <Typography color="#000000" fontSize={13} fontWeight="bold" marginTop="2px">
                  Community Center Mafraq
                </Typography>
                <Typography color="#000000" fontSize={11} marginTop="2px">
                  ENGLISH PROGRAM
                </Typography>
                <Typography color="#000000" fontSize={11} marginTop="2px">
                  12 Mafraq 25110
                </Typography>
                <Typography color="#000000" fontSize={10} marginTop="2px">
                  Email: ccmafraqenglish@gmail.com
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#FFD966",
                    borderColor: "#000000",
                    borderStyle: "solid",
                    borderWidth: 1,
                    marginTop: "20px",
                    width: "100%",
                  }}
                >
                  <Typography color="#000000" fontSize={13} fontWeight="bold">
                    {student.epId}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "18px",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  borderColor: "#000000",
                  borderStyle: "solid",
                  borderWidth: 1,
                  display: "flex",
                  height: "36px",
                  paddingLeft: "3px",
                  paddingRight: "3px",
                  width: "140px",
                }}
              >
                <Box sx={{ margin: "auto" }}>
                  <Typography color="#000000" fontSize={13} fontWeight="bold">
                    {shortEnglishName}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  borderColor: "#000000",
                  borderLeft: 0,
                  borderStyle: "solid",
                  borderWidth: 1,
                  display: "flex",
                  width: "170px",
                }}
              >
                <Box sx={{ margin: "auto" }}>
                  <Typography color="#000000" fontSize={13} fontWeight="bold">
                    {student.name.arabic}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </div>
      </Dialog>
    </Box>
  );
};
