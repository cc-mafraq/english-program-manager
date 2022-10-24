import { Box, Card, CardContent, Tab, Tabs, useTheme } from "@mui/material";
import { get, map } from "lodash";
import React, { Attributes, CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { darkBlueBackground } from "../../../interfaces";

interface TabProps {
  component: React.ReactNode;
  hidden?: boolean;
  label: string;
}

interface CustomCardProps<T> {
  data: T;
  header?: React.ReactNode;
  id?: string | number;
  image?: React.ReactNode;
  index?: number;
  noTabs?: boolean;
  setSize?: (index: number, size: number) => void;
  setTabValue?: (id: string | number, tabValue: number) => void;
  style?: CSSProperties;
  tabContents: TabProps[];
  tabValue?: number;
  windowWidth?: number;
}

export const CustomCard = <T,>({
  id,
  data,
  setSize,
  windowWidth,
  index,
  style,
  tabValue,
  setTabValue,
  noTabs,
  tabContents,
  image,
  header,
}: CustomCardProps<T>) => {
  const theme = useTheme();

  const rowRef = useRef<HTMLDivElement>(null);
  const [localTabValue, setLocalTabValue] = useState(tabValue || 0);

  useEffect(() => {
    if (rowRef.current && setSize && index !== undefined) {
      setSize(index, rowRef.current.clientHeight);
    }
  }, [index, setSize, windowWidth, localTabValue, rowRef.current?.clientHeight]);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setLocalTabValue(newValue);
      setTabValue && setTabValue(id || 0, newValue);
    },
    [setTabValue, id],
  );

  useEffect(() => {
    setLocalTabValue(tabValue || 0);
  }, [tabValue]);

  return (
    <div style={style ? { ...style, paddingLeft: "10px", paddingTop: "16px" } : undefined}>
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? darkBlueBackground : undefined,
          width: "100%",
        }}
      >
        <Box ref={rowRef} display="flex">
          {React.isValidElement(image) && React.cloneElement(image, { data } as Partial<unknown> & Attributes)}
          <Box
            sx={{
              width: `calc(100% - ${
                (get(image, "props.imageWidth") || 0) / (get(image, "props.smallBreakpointScaleDown") || 1)
              }px)`,
            }}
          >
            <CardContent>
              {React.isValidElement(header) &&
                React.cloneElement(header, { data } as Partial<unknown> & Attributes)}
              {!noTabs && (
                <Tabs onChange={handleChange} scrollButtons={false} value={localTabValue} variant="scrollable">
                  {map(tabContents, (content, i) => {
                    return <Tab key={`card-tabpanel-${i}`} id={`card-tabpanel-${i}`} label={content.label} />;
                  })}
                </Tabs>
              )}
              {map(tabContents, (content, i) => {
                return (
                  <Box
                    key={`card-tabbox-${i}`}
                    hidden={content.hidden || localTabValue !== i}
                    id={`card-tabpanel-${i}`}
                    role="tabpanel"
                  >
                    {React.isValidElement(content.component) &&
                      React.cloneElement(content.component, { data } as Partial<unknown> & Attributes)}
                  </Box>
                );
              })}
            </CardContent>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

CustomCard.defaultProps = {
  header: undefined,
  id: undefined,
  image: undefined,
  index: undefined,
  noTabs: false,
  setSize: undefined,
  setTabValue: undefined,
  style: undefined,
  tabValue: undefined,
  windowWidth: undefined,
};
