import { useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { join, last, map } from "lodash";
import React from "react";
import { LabeledText } from "..";
import { useColors } from "../../hooks";
import { FinalResult, GenderedLevel } from "../../interfaces";
import { SessionResult } from "../../services";

export const ProgressBox = ({
  level,
  sessionResults,
}: {
  level: GenderedLevel;
  sessionResults?: SessionResult[];
}) => {
  const theme = useTheme();
  const lastSessionResult = last(sessionResults)?.result;
  const isDarkAndYellow =
    theme.palette.mode === "dark" && lastSessionResult === undefined && sessionResults?.length;
  const { defaultBackgroundColor, green, yellow, red } = useColors();

  return (
    <LabeledText
      containerProps={{
        sx: {
          backgroundColor:
            sessionResults?.length === 0
              ? defaultBackgroundColor
              : lastSessionResult === "P"
              ? green
              : lastSessionResult === undefined
              ? yellow
              : red,

          marginRight: "0.5vw",
          minWidth: "3vw",
          padding: "0.3vw",
        },
      }}
      label={level}
      labelProps={{
        color: isDarkAndYellow ? grey[800] : theme.palette.text.secondary,
        fontWeight: "bold",
      }}
      showWhenEmpty
      textProps={{
        color: isDarkAndYellow ? grey[900] : theme.palette.text.primary,
      }}
    >
      {join(
        map(sessionResults, (sr) => {
          return sr.result === FinalResult.WD ? `${sr.session} WD` : sr.session;
        }),
        ", ",
      )}
    </LabeledText>
  );
};

ProgressBox.defaultProps = {
  sessionResults: [],
};
