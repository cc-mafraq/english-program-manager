import React from "react";
import { useFormContext } from "react-hook-form";
import { FormPlacementExamItem } from "..";
import { useFormList, useWaitingListStore } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";
import { SPACING } from "../../services";
import { FormLabel, FormList, GridContainer } from "../reusables";

interface FormPlacementExamProps {
  disabled: boolean;
}

export const FormPlacementExam: React.FC<FormPlacementExamProps> = ({ disabled }) => {
  const selectedWaitingListEntry = useWaitingListStore((state) => {
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
          disabled={disabled}
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
