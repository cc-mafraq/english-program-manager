import { useTheme } from "@mui/material";
import { green as materialGreen, grey, red as materialRed, yellow as materialYellow } from "@mui/material/colors";

export const useColors = () => {
  const theme = useTheme();
  const defaultBackgroundColor = theme.palette.mode === "light" ? "#f0f0f0" : "#2B3036";
  const red = theme.palette.mode === "light" ? materialRed[200] : materialRed[900];
  const green = theme.palette.mode === "light" ? materialGreen[200] : "#256E29";
  const yellow = theme.palette.mode === "light" ? materialYellow[200] : materialYellow[600];
  const iconColor = theme.palette.mode === "dark" ? grey[200] : undefined;
  const popoverColor = theme.palette.mode === "light" ? "#f5f5f5" : "#00000b";
  return {
    defaultBackgroundColor,
    green,
    iconColor,
    popoverColor,
    red,
    yellow,
  };
};
