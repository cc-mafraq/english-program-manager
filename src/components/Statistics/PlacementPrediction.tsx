import {
  Box,
  Button,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { get, isEmpty, keys, map, sum, values } from "lodash";
import React, { useState } from "react";
import { useStudentStore } from "../../hooks";
import { genderedLevels } from "../../interfaces";
import { predictPlacements } from "../../services";

interface PlacementPredictionProps {
  INDENT: number;
  textProps: TypographyProps;
}

export const PlacementPrediction: React.FC<PlacementPredictionProps> = ({ textProps, INDENT }) => {
  const theme = useTheme();
  const students = useStudentStore((state) => {
    return state.students;
  });
  const [finishedCurrentSession, setFinishedCurrentSession] = useState(false);
  const [numNewStudents, setNumNewStudents] = useState<null | number>(null);
  const [percentageMaleStudents, setPercentageMaleStudents] = useState<null | number>(null);
  const [currentWeek, setCurrentWeek] = useState<null | number>(null);
  const [totalWeeks, setTotalWeeks] = useState<null | number>(null);
  const [predictedRegistration, setPredictedRegistration] = useState({});

  const onSubmit = () => {
    setPredictedRegistration(
      predictPlacements(
        students,
        finishedCurrentSession,
        numNewStudents,
        percentageMaleStudents,
        currentWeek,
        totalWeeks,
      ),
    );
  };

  return (
    <>
      <Typography {...textProps} fontWeight="bold">
        Predict Registration Numbers for Next Session
      </Typography>
      <Box>
        <Box margin={1} marginBottom={0}>
          <Typography {...textProps}>Finished Current Session? </Typography>
          <RadioGroup
            defaultValue="No"
            onChange={(e) => {
              setFinishedCurrentSession(e.target.value === "Yes");
            }}
            sx={{ flexDirection: "row", marginTop: -1 }}
          >
            <FormControlLabel control={<Radio value="Yes" />} label="Yes" sx={{ ...textProps }} />
            <FormControlLabel control={<Radio value="No" />} label="No" sx={{ ...textProps }} />
          </RadioGroup>
        </Box>
        <Box>
          <TextField
            label="Number of New Students Remaining"
            onChange={(e) => {
              setNumNewStudents(Number(e.target.value));
            }}
            sx={{ margin: 1 }}
          />
          <TextField
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            label="Percentage Male New Students"
            onChange={(e) => {
              setPercentageMaleStudents(Number(e.target.value) / 100);
            }}
            sx={{ margin: 1 }}
          />
        </Box>
        {!finishedCurrentSession && (
          <Box flexDirection="row">
            <TextField
              label="Current Week in Session"
              onChange={(e) => {
                setCurrentWeek(Number(e.target.value));
              }}
              sx={{ margin: 1 }}
            />
            <TextField
              label="Total Weeks in Session"
              onChange={(e) => {
                setTotalWeeks(Number(e.target.value));
              }}
              sx={{ margin: 1 }}
            />
          </Box>
        )}
        <Button
          onClick={onSubmit}
          sx={{
            "&:hover": {
              backgroundColor: green[900],
            },
            backgroundColor: green[800],
            color: theme.palette.mode === "light" ? "white" : grey[200],
            margin: 1,
          }}
          variant="contained"
        >
          Submit
        </Button>
      </Box>
      {!isEmpty(predictedRegistration) &&
        map(genderedLevels, (level) => {
          const levelPredictedRegistration = get(predictedRegistration, level);
          return (
            <>
              <Typography {...textProps} fontWeight="bold" marginLeft={INDENT}>
                {level}: {sum(values(levelPredictedRegistration))}
              </Typography>
              {map(keys(levelPredictedRegistration), (key) => {
                return (
                  <Typography {...textProps} marginLeft={INDENT * 2}>
                    {key}: {get(levelPredictedRegistration, key)}
                  </Typography>
                );
              })}
            </>
          );
        })}
    </>
  );
};
