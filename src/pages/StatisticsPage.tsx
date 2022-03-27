import { Box, Typography, TypographyProps, useTheme } from "@mui/material";
import { get, keys, map, round } from "lodash";
import React from "react";
import { useStatistics } from "../hooks";

const INDENT = 3;

export const StatisticsPage = () => {
  const theme = useTheme();
  const statistics = useStatistics();
  const textProps: TypographyProps = {
    color: theme.palette.text.primary,
    marginTop: 1,
  };

  return (
    <Box marginLeft="10%">
      <Typography {...textProps}>
        Active Students: {statistics.totalActive} (
        {round(statistics.totalActive / statistics.totalRegistered, 3) * 100 || 0}
        %)
      </Typography>
      {map(keys(statistics.activeNationalityCounts), (key) => {
        return (
          <Typography {...textProps} key={`active-nationality-${key}`} marginLeft={INDENT}>
            Active {key}: {get(statistics.activeNationalityCounts, key)}
          </Typography>
        );
      })}
      {map(keys(statistics.activeLevelCounts), (key) => {
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
      <Typography {...textProps} marginLeft={INDENT}>
        Total Male: {get(statistics.genderCounts, "M")}
      </Typography>
      <Typography {...textProps} marginLeft={INDENT}>
        Total Female: {get(statistics.genderCounts, "F")}
      </Typography>
      {map(keys(statistics.nationalityCounts), (key) => {
        return (
          <Typography {...textProps} key={`nationality-${key}`} marginLeft={INDENT}>
            Total {key}: {get(statistics.nationalityCounts, key)}
          </Typography>
        );
      })}
      {map(keys(statistics.levelCounts), (key) => {
        return (
          <Typography {...textProps} key={`level-${key}`} marginLeft={INDENT}>
            Total {key}: {get(statistics.levelCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps}>Average Age at Program Entry: {round(statistics.averageAge, 2)}</Typography>
      <Typography {...textProps}>Total Teachers: {statistics.totalTeachers}</Typography>
      <Typography {...textProps}>Total English Teachers: {statistics.totalEnglishTeachers}</Typography>
      <Typography {...textProps}>Total Illiterate Arabic: {statistics.totalIlliterateArabic}</Typography>
      <Typography {...textProps}>Total Illiterate English: {statistics.totalIlliterateEnglish}</Typography>
      <Typography {...textProps} fontWeight="bold">
        Statuses
      </Typography>
      {map(keys(statistics.statusCounts), (key) => {
        return (
          <Typography {...textProps} key={`status-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.statusCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Initial Sessions
      </Typography>
      {map(keys(statistics.sessionCounts), (key) => {
        return (
          <Typography {...textProps} key={`session-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.sessionCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        COVID Statistics
      </Typography>
      {map(keys(statistics.covidStatusCounts), (key) => {
        return (
          <Typography {...textProps} key={`covid-status-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.covidStatusCounts, key)}
          </Typography>
        );
      })}
      {map(keys(statistics.fullVaccineNationalityCounts), (key) => {
        return (
          <Typography {...textProps} key={`full-vaccine-nationality-${key}`} marginLeft={INDENT}>
            {key} Fully Vaccinated: {get(statistics.fullVaccineNationalityCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Withdraw Reasons
      </Typography>
      {map(keys(statistics.droppedOutReasonCounts), (key) => {
        return (
          <Typography {...textProps} key={`withdraw-reason-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.droppedOutReasonCounts, key)}
          </Typography>
        );
      })}
    </Box>
  );
};
