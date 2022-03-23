import { join, map, some } from "lodash";
import React, { useContext } from "react";
import { LabeledContainer, LabeledText } from ".";
import { AppContext, Student } from "../../interfaces";
import { JOIN_STR } from "../../services";

interface PlacementProps {
  student: Student;
}

export const Placement: React.FC<PlacementProps> = ({ student }) => {
  const {
    appState: { dataVisibility },
  } = useContext(AppContext);

  return (
    <LabeledContainer
      condition={some([
        dataVisibility.placement.classScheduleSentDate && student.placement.classScheduleSentDate,
        dataVisibility.placement.naClassScheduleWpm && student.placement.noAnswerClassScheduleWpm,
        dataVisibility.placement.pending && student.placement.pending,
        dataVisibility.placement.photoContact && student.placement.photoContact,
        dataVisibility.placement.placement && student.placement.placement?.length,
        dataVisibility.placement.sectionsOffered && student.placement.sectionsOffered,
      ])}
      label="Placement"
    >
      <LabeledText condition={dataVisibility.placement.photoContact} label="Photo Contact">
        {student.placement.photoContact}
      </LabeledText>
      {map(student.placement.placement, (pl, i) => {
        return dataVisibility.placement.placement ? (
          <div key={`${student.epId}-placement-${i}`}>
            <LabeledText label="Section and Date">{pl.sectionAndDate}</LabeledText>
            <LabeledText label="Notes">{pl.notes}</LabeledText>
            <LabeledText label="Added to CL">{pl.addedToCL ? "Yes" : "No"}</LabeledText>
          </div>
        ) : (
          <></>
        );
      })}
      <LabeledText condition={dataVisibility.placement.classScheduleSentDate} label="Class Schedule Sent Date">
        {join(student.placement.classScheduleSentDate, JOIN_STR)}
      </LabeledText>
      <LabeledText condition={dataVisibility.placement.sectionsOffered} label="Sections Offered">
        {student.placement.sectionsOffered}
      </LabeledText>
      <LabeledText condition={dataVisibility.placement.naClassScheduleWpm} label="NA Class Schedule WPM">
        {student.placement.noAnswerClassScheduleWpm ? "Yes" : undefined}
      </LabeledText>
      <LabeledText condition={dataVisibility.placement.pending} label="Pending">
        {student.placement.pending ? "Yes" : undefined}
      </LabeledText>
    </LabeledContainer>
  );
};
