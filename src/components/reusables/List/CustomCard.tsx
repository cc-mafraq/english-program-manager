import { Box, Card, CardContent, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { map } from "lodash";
import React, { Attributes, CSSProperties, useCallback, useRef, useState } from "react";

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
  noTabs?: boolean;
  setTabValue?: (id: string | number, tabValue: number) => void;
  style?: CSSProperties;
  tabContents: TabProps[];
  tabValue?: number;
}

export const CustomCard = <T,>({
  id,
  data,
  style,
  tabValue,
  setTabValue,
  noTabs,
  tabContents,
  image,
  header,
}: CustomCardProps<T>) => {
  const theme = useTheme();
  const greaterThanSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const rowRef = useRef<HTMLDivElement>(null);
  // use a local tab value because updating tabValue prop in parent is a ref (i.e. won't trigger re-render)
  const [localTabValue, setLocalTabValue] = useState(tabValue || 0);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setLocalTabValue(newValue);
      setTabValue && setTabValue(id || 0, newValue);
    },
    [setTabValue, id],
  );

  const padding = { paddingLeft: "10px", paddingTop: "16px" };

  return (
    <div style={style ? { ...style, ...padding } : padding}>
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : undefined,
          width: "100%",
        }}
      >
        <Box ref={rowRef}>
          <Box sx={{ float: "left", marginRight: "15px" }}>
            {React.isValidElement(image) && React.cloneElement(image, { data } as Partial<unknown> & Attributes)}
          </Box>
          <Box>
            <CardContent>
              {React.isValidElement(header) &&
                React.cloneElement(header, { data } as Partial<unknown> & Attributes)}
              {!noTabs && (
                <Tabs
                  onChange={handleChange}
                  scrollButtons={false}
                  sx={greaterThanSmall ? undefined : { width: "100%" }}
                  value={localTabValue}
                  variant="scrollable"
                >
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
  noTabs: false,
  setTabValue: undefined,
  style: undefined,
  tabValue: undefined,
};
