import { Close, Search } from "@mui/icons-material";
import { alpha, Box, IconButton, InputBase, Tooltip, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import React, { MouseEvent, useRef, useState } from "react";
import { useColors } from "../../../hooks";

interface SearchbarProps {
  handleSearchStringChange: (value: string) => void;
  noExpand?: boolean;
  placeholder: string;
  searchString?: string;
  width?: string;
}

const minSearchLength = 3;
const searchDelay = 500;

export const Searchbar: React.FC<SearchbarProps> = ({
  handleSearchStringChange,
  noExpand,
  width,
  placeholder,
  searchString,
}) => {
  const theme = useTheme();
  const { iconColor } = useColors();
  const [value, setValue] = useState("");
  const searchbarRef = useRef<HTMLDivElement>();

  const [prevSearchString, setPrevSearchString] = useState(searchString);
  if (searchString !== undefined && prevSearchString !== searchString) {
    setValue(searchString);
    setPrevSearchString(searchString);
  }

  const handleLocalSearchStringChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.length >= minSearchLength || isEmpty(e.target.value)) {
      setTimeout(() => {
        handleSearchStringChange(e.target.value);
      }, searchDelay);
    }
  };

  const handleClearSearch = (e: MouseEvent) => {
    e.preventDefault();
    searchbarRef.current?.focus();
    setValue("");
    handleSearchStringChange("");
  };

  return (
    <Box
      sx={{
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.common.black, 0.1)
              : alpha(theme.palette.common.white, 0.01),
        },
        backgroundColor:
          theme.palette.mode === "light"
            ? alpha(theme.palette.common.black, 0.05)
            : alpha(theme.palette.common.black, 0.1),
        borderRadius: theme.shape.borderRadius,
        display: "inline",
        marginLeft: 0,
        padding: theme.spacing(1, 0, 1, 0),
        position: "relative",
        [theme.breakpoints.up("sm")]: {
          marginLeft: theme.spacing(1),
          padding: theme.spacing(1.5, 0, 1.5, 0),
          width: "auto",
        },
        width: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          padding: theme.spacing(0, 3),
          pointerEvents: "none",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <Search color="primary" />
      </Box>
      <InputBase
        inputProps={{ "aria-label": "search" }}
        inputRef={searchbarRef}
        onChange={handleLocalSearchStringChange}
        placeholder={placeholder}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: "13pt",
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(5)})`,
            transition: theme.transitions.create("width"),
            [theme.breakpoints.up("sm")]: {
              "&:focus": {
                width: noExpand ? width || "35vw" : "40vw",
              },
              width: width || "35vw",
            },
            [theme.breakpoints.down("sm")]: {
              height: "15px",
            },
          },
          color: "inherit",
        }}
        value={value}
      />
      <Tooltip arrow title="Clear Search">
        <IconButton
          onMouseDown={handleClearSearch}
          sx={{
            display: "flex",
            height: "100%",
            padding: theme.spacing(0, 2),
            position: "absolute",
            right: 0,
            top: 0,
            width: "45px",
          }}
        >
          <Close sx={{ color: iconColor }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

Searchbar.defaultProps = {
  noExpand: false,
  searchString: undefined,
  width: undefined,
};
