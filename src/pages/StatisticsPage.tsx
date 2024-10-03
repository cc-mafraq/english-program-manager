import { Box, Typography, TypographyProps, useTheme } from "@mui/material";
import { get, isEmpty, keys, map, round, sortBy, sum, values } from "lodash";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlacementPrediction } from "../components/Statistics";
import { useAppStore, useStatistics, useStudentStore } from "../hooks";
import { levels } from "../interfaces";
import { getAllInitialSessions, sortObjectByValues } from "../services";

const INDENT = 3;

export const StatisticsPage = () => {
  const students = useStudentStore((state) => {
    return state.students;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const navigate = useNavigate();

  const theme = useTheme();
  const statistics = useStatistics();
  const textProps: TypographyProps = {
    color: theme.palette.text.primary,
    marginTop: 1,
  };

  const totalWaitingListOutcomes =
    sum(values(statistics.waitingListOutcomeCounts)) - (statistics.waitingListOutcomeCounts.undefined ?? 0);

  useEffect(() => {
    if (!statistics.totalRegistered) navigate("/epd", { replace: true });
  }, [navigate, statistics]);

  return statistics.totalRegistered && (role === "admin" || role === "faculty") ? (
    <Box marginLeft="10%" paddingBottom={5}>
      <Typography {...textProps}>
        Active Students: {statistics.totalActive} (
        {(round(statistics.totalActive / statistics.totalRegistered, 3) * 100 || 0).toFixed(1)}
        %)
      </Typography>
      <Typography {...textProps} fontWeight="bold">
        Active Nationalities
      </Typography>
      {map(keys(sortObjectByValues(statistics.activeNationalityCounts)).reverse(), (key) => {
        return (
          <Typography {...textProps} key={`active-nationality-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.activeNationalityCounts, key)} (
            {(round(get(statistics.activeNationalityCounts, key) / statistics.totalActive, 3) * 100).toFixed(1)}%)
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Active Levels
      </Typography>
      {map([...levels, "L5 GRAD"], (key) => {
        return (
          <Typography {...textProps} key={`active-level-${key}`} marginLeft={INDENT}>
            Active {key}: {get(statistics.activeLevelCounts, key)} (
            {(round((get(statistics.activeLevelCounts, key) ?? 0) / statistics.totalActive, 3) * 100).toFixed(1)}%)
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Active Students by Gender
      </Typography>
      <Typography {...textProps} marginLeft={INDENT}>
        Active Male: {get(statistics.activeGenderCounts, "M")} (
        {(round((get(statistics.activeGenderCounts, "M") ?? 0) / statistics.totalActive, 2) * 100).toFixed(0)}%)
      </Typography>
      <Typography {...textProps} marginLeft={INDENT}>
        Active Female: {get(statistics.activeGenderCounts, "F")} (
        {(round((get(statistics.activeGenderCounts, "F") ?? 0) / statistics.totalActive, 2) * 100).toFixed(0)}%)
      </Typography>
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
            {(round(get(statistics.statusDetailsCounts, key) / students.length, 2) * 100).toFixed(0)}%)
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Initial Sessions
      </Typography>
      {map(getAllInitialSessions(students), (key) => {
        return (
          <Typography {...textProps} key={`session-${key}`} marginLeft={INDENT}>
            {key}: {get(statistics.sessionCounts, key)}
          </Typography>
        );
      })}
      <Typography {...textProps} fontWeight="bold">
        Placement Registration Rates by Status
      </Typography>
      {map(statistics.placementRegistrationCounts, (placementRegistrationSessionCounts) => {
        return (
          <>
            <Typography {...textProps} fontWeight="bold" marginLeft={INDENT}>
              {placementRegistrationSessionCounts.session}
            </Typography>
            {map(keys(placementRegistrationSessionCounts.inviteCounts), (key) => {
              return (
                <Typography {...textProps} marginLeft={INDENT * 2}>
                  {key}: {get(placementRegistrationSessionCounts.registrationCounts, key)} of{" "}
                  {get(placementRegistrationSessionCounts.inviteCounts, key)} (
                  {(
                    round(
                      get(placementRegistrationSessionCounts.registrationCounts, key) /
                        get(placementRegistrationSessionCounts.inviteCounts, key),
                      2,
                    ) * 100
                  ).toFixed(0)}
                  %)
                </Typography>
              );
            })}
          </>
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
      <Typography {...textProps}>
        Average Age at Program Entry: {round(statistics.averageAge, 1).toFixed(1)}
      </Typography>
      <Typography {...textProps}>Total Teachers: {statistics.totalTeachers}</Typography>
      <Typography {...textProps}>Total English Teachers: {statistics.totalEnglishTeachers}</Typography>
      <Typography {...textProps}>Total Illiterate Arabic: {statistics.totalIlliterateArabic}</Typography>
      <Typography {...textProps}>Total Illiterate English: {statistics.totalIlliterateEnglish}</Typography>
      <PlacementPrediction INDENT={INDENT} textProps={textProps} />
      <Typography {...textProps} fontWeight="bold">
        Waiting List Outcomes
      </Typography>
      {!isEmpty(statistics.waitingListOutcomeCounts) ? (
        map(keys(sortObjectByValues(statistics.waitingListOutcomeCounts)).reverse(), (key) => {
          return (
            key !== "undefined" && (
              <Typography {...textProps} key={`waiting-list0outcome-${key}`} marginLeft={INDENT}>
                Total {key}: {get(statistics.waitingListOutcomeCounts, key)} (
                {(
                  round(get(statistics.waitingListOutcomeCounts, key) / totalWaitingListOutcomes, 2) * 100
                ).toFixed(0)}
                %)
              </Typography>
            )
          );
        })
      ) : (
        <Typography {...textProps} textAlign="center">
          Please go to the Waiting List page then return here to view Waiting List statistics
        </Typography>
      )}
    </Box>
  ) : (
    <></>
  );
};
