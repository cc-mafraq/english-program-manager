import { ArrowForwardIos } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Divider } from "@mui/material";
import { includes, map, without } from "lodash";
import React, { useCallback, useState } from "react";

export type EditFn = (i: number) => (e: React.MouseEvent) => void;

interface AccordionListProps<T> {
  DetailsComponent: React.FC<{ data: T }>;
  SummaryComponent: React.FC<{ data: T; handleEditClick?: EditFn; i: number }>;
  dataList: T[];
  handleEditClick?: EditFn;
  width?: string;
}

export const AccordionList = <T,>({
  SummaryComponent,
  DetailsComponent,
  dataList,
  handleEditClick,
  width,
}: AccordionListProps<T>) => {
  const [expanded, setExpanded] = useState([0]);

  const handleAccordionChange = useCallback(
    (recordIndex: number) => {
      return (event: React.SyntheticEvent, newExpanded: boolean) => {
        newExpanded ? setExpanded([...expanded, recordIndex]) : setExpanded(without(expanded, recordIndex));
      };
    },
    [expanded],
  );

  return (
    <>
      {map(dataList, (value, i) => {
        return (
          <Accordion
            key={i}
            expanded={includes(expanded, i)}
            onChange={handleAccordionChange(i)}
            sx={{
              "& .MuiCollapse-wrapperInner": {
                paddingBottom: "10px",
              },
              width,
            }}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary
              expandIcon={<ArrowForwardIos sx={{ fontSize: "0.9rem" }} />}
              sx={{
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  transform: "rotate(90deg)",
                },
                flexDirection: "row-reverse",
              }}
            >
              <SummaryComponent data={value} handleEditClick={handleEditClick} i={i} />
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <DetailsComponent data={value} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

AccordionList.defaultProps = {
  handleEditClick: undefined,
  width: undefined,
};
