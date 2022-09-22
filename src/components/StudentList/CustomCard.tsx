import { Box, Card, CardContent, Tab, Tabs, useTheme } from "@mui/material";
import { map } from "lodash";
import React, { Attributes, CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { darkBlueBackground } from "../../interfaces";

interface TabProps<T> {
  component: React.FC<{ data: T }>;
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
  tabContents: TabProps<T>[];
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
          <Box width="100%">
            <CardContent>
              {React.isValidElement(header) &&
                React.cloneElement(header, { data } as Partial<unknown> & Attributes)}
              {!noTabs && (
                <Tabs onChange={handleChange} sx={{ display: "inline" }} value={localTabValue}>
                  {map(tabContents, (content, i) => {
                    return <Tab id={`student-card-tabpanel-${i}`} label={content.label} />;
                  })}
                </Tabs>
              )}
              {map(tabContents, (content, i) => {
                return (
                  <Box
                    hidden={content.hidden || localTabValue !== i}
                    id={`student-card-tabpanel-${i}`}
                    role="tabpanel"
                  >
                    <content.component data={data} />
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
