import { Badge, Close, Download } from "@mui/icons-material";
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
    return cardRef.current ? toPng(cardRef.current) : null;
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
      <Dialog
        maxWidth="md"
        onClose={handleDialogClose}
        open={open}
        PaperProps={{ style: { backgroundColor: "#ffffff", padding: "10px" } }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <Tooltip arrow title="Download ID Card">
            <IconButton
              color={theme.palette.mode === "dark" ? "secondary" : "primary"}
              onClick={handleDownload}
              sx={{ transform: "scale(1.25)" }}
            >
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Close Window">
            <IconButton
              color={theme.palette.mode === "dark" ? "error" : "default"}
              onClick={handleDialogClose}
              sx={{ transform: "scale(1.25)" }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
        <div ref={cardRef}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderColor: "#000000",
              borderStyle: "solid",
              borderWidth: 3,
              height: "360px",
              padding: "36px",
              width: "640px",
            }}
          >
            <Box display="flex" flexDirection="row">
              <Box
                sx={{
                  alignItems: "center",
                  borderColor: "#000000",
                  borderStyle: "solid",
                  borderWidth: 3,
                  height: "230px",
                  width: "280px",
                }}
              >
                <img
                  alt={`${student.name.english}`}
                  height="230px"
                  src={student.imageName}
                  style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                />
              </Box>
              <Box sx={{ marginLeft: "20px", textAlign: "center" }}>
                <Typography color="#000000" fontSize={26} fontWeight="bold" marginTop="4px">
                  Community Center Mafraq
                </Typography>
                <Typography color="#000000" fontSize={22} marginTop="4px">
                  ENGLISH PROGRAM
                </Typography>
                <Typography color="#000000" fontSize={22} marginTop="4px">
                  12 Mafraq 25110
                </Typography>
                <Typography color="#000000" fontSize={20} marginTop="4px">
                  Email: ccmafraqenglish@gmail.com
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#FFD966",
                    borderColor: "#000000",
                    borderStyle: "solid",
                    borderWidth: 2,
                    marginTop: "40px",
                    width: "100%",
                  }}
                >
                  <Typography color="#000000" fontSize={26} fontWeight="bold">
                    {student.epId}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "36px",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  borderColor: "#000000",
                  borderStyle: "solid",
                  borderWidth: 2,
                  display: "flex",
                  height: "72px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  width: student.name.arabic === "N/A" ? "620px" : "280px",
                }}
              >
                <Box sx={{ margin: "auto" }}>
                  <Typography color="#000000" fontSize={26} fontWeight="bold">
                    {shortEnglishName}
                  </Typography>
                </Box>
              </Box>
              {student.name.arabic !== "N/A" && (
                <Box
                  sx={{
                    borderColor: "#000000",
                    borderLeft: "0px none white",
                    borderStyle: "solid",
                    borderWidth: 2,
                    display: "flex",
                    width: "340px",
                  }}
                >
                  <Box sx={{ margin: "auto" }}>
                    <Typography color="#000000" fontSize={26} fontWeight="bold">
                      {student.name.arabic}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </Dialog>
    </Box>
  );
};
