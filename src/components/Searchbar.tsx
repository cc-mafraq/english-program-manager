import SearchIcon from "@mui/icons-material/Search";
import { alpha, Box, InputBase, useTheme } from "@mui/material";
import React from "react";

interface SearchbarProps {
  handleSearchStringChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  searchString: string;
}

export const Searchbar: React.FC<SearchbarProps> = ({ searchString, handleSearchStringChange }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        "&:hover": {
          backgroundColor: alpha(theme.palette.common.black, 0.1),
        },
        backgroundColor: alpha(theme.palette.common.black, 0.05),
        borderRadius: theme.shape.borderRadius,
        display: "inline",
        marginLeft: 0,
        padding: theme.spacing(1, 0),
        position: "relative",
        width: "100%",
        [theme.breakpoints.up("sm")]: {
          marginLeft: theme.spacing(1),
          width: "auto",
        },
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: theme.spacing(0, 2),
          pointerEvents: "none",
          position: "absolute",
        }}
      >
        <SearchIcon color="primary" />
      </Box>
      <InputBase
        inputProps={{ "aria-label": "search" }}
        onChange={handleSearchStringChange}
        placeholder="Search students"
        sx={{
          "& .MuiInputBase-input": {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("sm")]: {
              "&:focus": {
                width: "65ch",
              },
              width: "50ch",
            },
          },
          color: "inherit",
        }}
        value={searchString}
      />
    </Box>
  );
};
