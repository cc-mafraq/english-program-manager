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

  const splitEnglishName = student.name.english.split(" ");
  const idWordNum = splitEnglishName.length < 2 ? 1 : splitEnglishName[1] === "Al" ? 3 : 2;
  const shortEnglishName = splitEnglishName.slice(0, idWordNum).join(" ");
  const padding = "36px";
  const black = "#000000";
  const blackBorder = { borderColor: black, borderStyle: "solid" };
  const textMarginTop = "4px";
  const imageHeight = "230px";
  const buttonScale = "1.25";

  const handleDownload = useCallback(async () => {
    const imgData = cardRef.current ? await toPng(cardRef.current) : null;
    imgData && (await download(imgData, `${student.epId}.jpeg`));
  }, [student.epId]);

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
        PaperProps={{ style: { overflowX: "hidden", padding: "10px" } }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <Tooltip arrow title="Download ID Card">
            <IconButton color="primary" onClick={handleDownload} sx={{ transform: `scale(${buttonScale})` }}>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Close Window">
            <IconButton color="default" onClick={handleDialogClose} sx={{ transform: `scale(${buttonScale})` }}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
        <div ref={cardRef}>
          <Box
            sx={{
              ...blackBorder,
              backgroundColor: "#ffffff",
              borderWidth: 3,
              height: "360px",
              padding,
              width: "640px",
            }}
          >
            <Box display="flex" flexDirection="row">
              <Box
                sx={{
                  ...blackBorder,
                  alignItems: "center",
                  borderWidth: 3,
                  height: imageHeight,
                  width: "280px",
                }}
              >
                <img
                  alt={`${student.name.english}`}
                  height={imageHeight}
                  src={student.imageName}
                  style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                />
              </Box>
              <Box sx={{ marginLeft: "20px", textAlign: "center" }}>
                <Typography color={black} fontSize={26} fontWeight="bold" marginTop={textMarginTop}>
                  Community Center Mafraq
                </Typography>
                <Typography color={black} fontSize={22} marginTop={textMarginTop}>
                  ENGLISH PROGRAM
                </Typography>
                <Typography color={black} fontSize={22} marginTop={textMarginTop}>
                  12 Mafraq 25110
                </Typography>
                <Typography color={black} fontSize={20} marginTop={textMarginTop}>
                  Email: ccmafraqenglish@gmail.com
                </Typography>
                <Box
                  sx={{
                    ...blackBorder,
                    backgroundColor: "#FFD966",
                    borderWidth: 2,
                    marginTop: "40px",
                    width: "100%",
                  }}
                >
                  <Typography color={black} fontSize={26} fontWeight="bold">
                    {student.epId}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: padding,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  ...blackBorder,
                  borderWidth: 2,
                  display: "flex",
                  height: "72px",
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  width: student.name.arabic === "N/A" ? "620px" : "280px",
                }}
              >
                <Box sx={{ margin: "auto" }}>
                  <Typography color={black} fontSize={26} fontWeight="bold">
                    {shortEnglishName}
                  </Typography>
                </Box>
              </Box>
              {student.name.arabic !== "N/A" && (
                <Box
                  sx={{
                    ...blackBorder,
                    borderLeft: "0px none white",
                    borderWidth: 2,
                    display: "flex",
                    width: "340px",
                  }}
                >
                  <Box sx={{ margin: "auto" }}>
                    <Typography color={black} fontSize={26} fontWeight="bold">
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
