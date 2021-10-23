import { join, last, map } from "lodash";
import React from "react";
import { LabeledText } from ".";
import { GenderedLevel } from "../interfaces";
import { SessionResult } from "../services";

export const ProgressBox = ({
  level,
  sessionResults,
}: {
  level: GenderedLevel;
  sessionResults?: SessionResult[];
}) => {
  return (
    <LabeledText
      containerProps={{
        sx: {
          backgroundColor:
            last(sessionResults)?.result === 0
              ? "lightgreen"
              : last(sessionResults)?.result === undefined
              ? "yellow"
              : "red",
          marginRight: "0.5vw",
          padding: "0.3vw",
        },
      }}
      label={level}
    >
      {join(map(sessionResults, "session"), ", ")}
    </LabeledText>
  );
};

ProgressBox.defaultProps = {
  sessionResults: [],
};
