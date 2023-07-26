import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

export const StudentDatabaseHome = () => {
  const theme = useTheme();

  return (
    <Box color="white" position="relative" textAlign="center">
      <Box
        sx={{
          fontVariant: "small-caps",
          left: "50%",
          position: "absolute",
          textShadow: "1.5px 1.5px #000000",
          top: "20vh",
          transform: "translate(-50%, -50%)",
          width: "100%",
        }}
      >
        <Typography letterSpacing="0.5vw" variant="h3">
          Welcome to the CCM Student Database!
        </Typography>
        <Typography letterSpacing="0.5vw" marginTop="1vh" variant="h3">
          <SearchOutlined
            fontSize="large"
            sx={{
              color: theme.palette.primary.main,
              filter: "drop-shadow(0.75px 0.75px #000000)",
              marginRight: "10px",
              marginTop: "5px",
            }}
          />
          search or{" "}
          <FilterListOutlined
            fontSize="large"
            sx={{
              color: theme.palette.primary.main,
              filter: "drop-shadow(0.75px 0.75px #000000)",
              marginRight: "10px",
              marginTop: "5px",
            }}
          />
          filter to get started.
        </Typography>
      </Box>
      <img
        alt="Mafraq Art"
        src={theme.palette.mode === "dark" ? "./assets/mafraq-art-wide-dark.jpg" : "./assets/mafraq-art-wide.jpg"}
        width="100%"
      />
    </Box>
  );
};
