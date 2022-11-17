import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useStore } from "zustand";
import { FormPlacementExamItem } from "..";
import { AppContext } from "../../App";
import { useFormList } from "../../hooks";
import {  WaitingListEntry } from "../../interfaces";
import { SPACING } from "../../services";
import { FormLabel, FormList, GridContainer } from "../reusables";

export const FormPlacementExam = () => {
  const store = useContext(AppContext);
  const selectedWaitingListEntry = useStore(store, (state) => {
    return state.selectedWaitingListEntry;
  });
  const methods = useFormContext<WaitingListEntry>();

  const [placementExams, addPlacementExam, removePlacementExam] = useFormList(
    selectedWaitingListEntry &&
      selectedWaitingListEntry.placementExam &&
      selectedWaitingListEntry.placementExam.length
      ? selectedWaitingListEntry.placementExam
      : [""],
    "placementExam",
    methods,
  );
  return (
    <>
      <FormLabel textProps={{ marginTop: SPACING }}>Placement Exam</FormLabel>
      <GridContainer>
        <FormList
          addItem={addPlacementExam}
          buttonLabel="Add Placement Exam"
          list={placementExams}
          listName="placementExam"
          removeItem={removePlacementExam}
        >
          <FormPlacementExamItem />
        </FormList>
      </GridContainer>
    </>
  );
};
