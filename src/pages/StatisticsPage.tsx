import { Box, Typography, TypographyProps, useTheme } from "@mui/material";
import { getAuth } from "firebase/auth";
import { get, keys, map, round, sortBy } from "lodash";
import React, { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useStatistics } from "../hooks";
import { AppContext, levels } from "../interfaces";
import { app, getAllSessions, sortObjectByValues } from "../services";

const INDENT = 3;

export const StatisticsPage = () => {
  const {
    appState: { students },
  } = useContext(AppContext);
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const theme = useTheme();
  const statistics = useStatistics();
  const textProps: TypographyProps = {
    color: theme.palette.text.primary,
    marginTop: 1,
  };
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/", { replace: true });
    if (!statistics.totalRegistered) navigate("/epd", { replace: true });
  }, [user, loading, navigate, statistics]);

  return statistics.totalRegistered ? (
    <Box marginLeft="10%" paddingBottom={5}>
      <Typography {...textProps}>
        Active Students: {statistics.totalActive} (
        {round(statistics.totalActive / statistics.totalRegistered, 3) * 100 || 0}
        %)
      </Typography>
      <Typography {...textProps} fontWeight="bold">
        Active Nationalities
      </Typography>
      {map(keys(sortObjectByValues(statistics.activeNationalityCounts)).reverse(), (key) => {
        return (
          <Typography {...textProps} key={`active-nationality-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.activeNationalityCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Active Levels
      </Typography>
      {map([...levels, "L5 GRAD"], (key) => {
        return (
          <Typography {...textProps} key={`active-level-${key}`} marginLeft={INDENT}>
            Active {key}: {get(statistics.activeLevelCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps}>Current Pending Enrollment: {statistics.totalPending}</Typography>
      <Typography {...textProps}>Total Eligible for Next Session: {statistics.totalEligible}</Typography>
      <Typography {...textProps}>Total on No Contact List: {statistics.totalNCL}</Typography>
      <Typography {...textProps}>Total Registered: {statistics.totalRegistered}</Typography>
      <Typography {...textProps} fontWeight="bold">
        Gender
      </Typography>
      <Typography {...textProps} marginLeft={INDENT}>
        Total Male: {get(statistics.genderCounts, "M")}
      </Typography>
      <Typography {...textProps} marginLeft={INDENT}>
        Total Female: {get(statistics.genderCounts, "F")}
      </Typography>
      <Typography {...textProps} fontWeight="bold">
        Total Nationalities
      </Typography>
      {map(keys(sortObjectByValues(statistics.nationalityCounts)).reverse(), (key) => {
        return (
          <Typography {...textProps} key={`nationality-${key}`} marginLeft={INDENT}>
            Total {key}: {get(statistics.nationalityCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Total Levels
      </Typography>
      {map([...levels, "L5 GRAD"], (key) => {
        return (
          <Typography {...textProps} key={`level-${key}`} marginLeft={INDENT}>
            Total {key}: {get(statistics.levelCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Statuses
      </Typography>
      {map(keys(sortObjectByValues(statistics.statusCounts)).reverse(), (key) => {
        return (
          <Typography {...textProps} key={`status-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.statusCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Status Details
      </Typography>
      {map(sortBy(keys(statistics.statusDetailsCounts)), (key) => {
        return (
          <Typography {...textProps} key={`status-details-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.statusDetailsCounts, key)} (
            {round(get(statistics.statusDetailsCounts, key) / students.length, 3) * 100}%)
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Initial Sessions
      </Typography>
      {map(getAllSessions(students), (key) => {
        return (
          <Typography {...textProps} key={`session-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.sessionCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        COVID Statistics
      </Typography>
      {map(keys(sortObjectByValues(statistics.covidStatusCounts)).reverse(), (key) => {
        return (
          <Typography {...textProps} key={`covid-status-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.covidStatusCounts, key)}
          </Typography>
        );
      })}
      {map(keys(sortObjectByValues(statistics.fullVaccineNationalityCounts)).reverse(), (key) => {
        return (
          <Typography {...textProps} key={`full-vaccine-nationality-${key}`} marginLeft={INDENT}>
            {key} Fully Vaccinated: {get(statistics.fullVaccineNationalityCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Withdraw Reasons
      </Typography>
      {map(keys(sortObjectByValues(statistics.droppedOutReasonCounts)).reverse(), (key) => {
        return (
          <Typography {...textProps} key={`withdraw-reason-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.droppedOutReasonCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps}>Average Age at Program Entry: {round(statistics.averageAge, 2)}</Typography>
      <Typography {...textProps}>Total Teachers: {statistics.totalTeachers}</Typography>
      <Typography {...textProps}>Total English Teachers: {statistics.totalEnglishTeachers}</Typography>
      <Typography {...textProps}>Total Illiterate Arabic: {statistics.totalIlliterateArabic}</Typography>
      <Typography {...textProps}>Total Illiterate English: {statistics.totalIlliterateEnglish}</Typography>
    </Box>
  ) : (
    <></>
  );
};
