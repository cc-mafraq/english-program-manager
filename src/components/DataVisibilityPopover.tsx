import { Popover } from "@mui/material";
import { map } from "lodash";
import React from "react";
import { DataVisibilityCheckboxGroup, IndeterminateCheckbox } from ".";

interface DataVisibilityPopoverProps {
  anchorEl: HTMLButtonElement | null;
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const labels: { childLabels: string[]; parentLabel: string }[] = [
  {
    childLabels: [
      "Attendance",
      "Certificate",
      "Certificate Requests",
      "Elective Class",
      "Exit Speaking Exam",
      "Exit Writing Exam",
      "Final Grade",
      "Level",
      "Level Audited",
      "Progress",
      "Result",
      "Session",
      "Teacher Comments",
    ],
    parentLabel: "Academic Records",
  },
  {
    childLabels: ["Notes", "Sent", "Sent Date"],
    parentLabel: "Class List",
  },
  {
    childLabels: ["Arabic Literacy", "English Literacy", "Tutor And Date"],
    parentLabel: "Literacy",
  },
  {
    childLabels: ["Phone Numbers", "WA Broadcast Other Groups", "WA Broadcast SAR", "WA Notes"],
    parentLabel: "Phone Numbers and WhatsApp",
  },
  {
    childLabels: [
      "NA Class Schedule",
      "Original Placement Data",
      "Pending",
      "Photo Contact",
      "Placement",
      "Placement Confirmed",
    ],
    parentLabel: "Placement",
  },
  {
    childLabels: [
      "Active",
      "Correspondence",
      "Current Level",
      "ID Number",
      "Initial Session",
      "Invite Tag",
      "No Contact List",
      "Status",
    ],
    parentLabel: "Program Information",
  },
  {
    childLabels: [
      "Audit",
      "Final GR Sent",
      "Level Reeval Date",
      "Reactivated Date",
      "Repeat Number",
      "Sections Offered",
      "Withdraw Date",
      "Withdraw Reason",
    ],
    parentLabel: "Status",
  },
  {
    childLabels: [
      "Age",
      "English Teacher",
      "English Teacher Location",
      "Gender",
      "Looking For Job",
      "Nationality",
      "Occupation",
      "Teacher",
      "Teaching Subject Area",
    ],
    parentLabel: "Student Information",
  },
  {
    childLabels: ["Tutor and Details"],
    parentLabel: "Zoom",
  },
];

export const DataVisibilityPopover: React.FC<DataVisibilityPopoverProps> = ({
  anchorEl,
  handleClose,
}) => {
  const open = Boolean(anchorEl);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      onClose={handleClose}
      open={open}
      transformOrigin={{
        horizontal: "left",
        vertical: "top",
      }}
    >
      {map(labels, (labelObj) => {
        return (
          <IndeterminateCheckbox key={labelObj.parentLabel} label={labelObj.parentLabel}>
            <DataVisibilityCheckboxGroup
              labels={labelObj.childLabels}
              parentLabel={labelObj.parentLabel}
            />
          </IndeterminateCheckbox>
        );
      })}
    </Popover>
  );
};
