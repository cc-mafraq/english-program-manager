import { useTheme } from "@mui/material";
import { green as materialGreen, red as materialRed, yellow as materialYellow } from "@mui/material/colors";

export const useColors = () => {
  const theme = useTheme();
  const defaultBackgroundColor = theme.palette.mode === "light" ? "#f0f0f0" : "#2B3036";
  const defaultBorderColor = "#808080";
  const red = theme.palette.mode === "light" ? materialRed[200] : materialRed[800];
  const green = theme.palette.mode === "light" ? materialGreen[200] : materialGreen[800];
  const yellow = theme.palette.mode === "light" ? materialYellow[200] : materialYellow[800];
  const darkBlueBackground = "#12161F";
  const iconColor = theme.palette.mode === "dark" ? theme.palette.text.primary : undefined;
  return { darkBlueBackground, defaultBackgroundColor, defaultBorderColor, green, iconColor, red, yellow };
};
