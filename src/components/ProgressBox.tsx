import { join, last, map } from "lodash";
import React from "react";
import { LabeledText } from ".";
import { FinalResult, GenderedLevel } from "../interfaces";
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
            sessionResults?.length === 0
              ? "none"
              : last(sessionResults)?.result === 0
              ? "rgba(198,224,180,1)"
              : last(sessionResults)?.result === undefined
              ? "rgba(245,255,150,1)"
              : "rgba(255,175,175,1)",

          marginRight: "0.5vw",
          minWidth: "3vw",
          padding: "0.3vw",
        },
      }}
      label={level}
      labelProps={{ fontWeight: "bold" }}
      showWhenEmpty
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
