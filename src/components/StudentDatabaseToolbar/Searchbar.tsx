import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, Box, IconButton, InputBase, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import React, { useState } from "react";

interface SearchbarProps {
  handleSearchStringChange: (value: string) => void;
}

const minSearchLength = 3;
const searchDelay = 500;

export const Searchbar: React.FC<SearchbarProps> = ({ handleSearchStringChange }) => {
  const theme = useTheme();
  const [value, setValue] = useState("");

  const handleLocalSearchStringChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.length >= minSearchLength || isEmpty(e.target.value)) {
      setTimeout(() => {
        handleSearchStringChange(e.target.value);
      }, searchDelay);
    }
  };

  const handleClearSearch = () => {
    setValue("");
    handleSearchStringChange("");
  };

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
        onChange={handleLocalSearchStringChange}
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
        value={value}
      />
      <IconButton
        onClick={handleClearSearch}
        sx={{
          display: "flex",
          height: "100%",
          padding: theme.spacing(0, 2),
          position: "absolute",
          right: 0,
          top: 0,
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};
