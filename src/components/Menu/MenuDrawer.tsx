import {
  AttachFile,
  AutoGraph,
  Create,
  Equalizer,
  FormatListBulleted,
  Home,
  LibraryBooks,
  Menu,
  Person,
  Schedule,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
  Tooltip,
  useTheme,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React, { KeyboardEvent, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lightPrimaryColor } from "../../interfaces";

const DRAWER_WIDTH = 250;
const DRAWER_ITEM_MARGIN = "0.87vh";

interface DrawerListItem {
  component: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, "svg">> & {
    muiName: string;
  };
  name: string;
  route?: string;
}

const iconProps = { style: { color: "white" } };
const drawerList: DrawerListItem[] = [
  {
    component: Home,
    name: "Home",
    route: "/epd",
  },
  {
    component: LibraryBooks,
    name: "Virtual Library",
  },
  {
    component: Person,
    name: "Student Database",
    route: "/epd",
  },
  {
    component: FormatListBulleted,
    name: "Class Lists",
  },
  {
    component: Create,
    name: "Attendance",
  },
  {
    component: Equalizer,
    name: "Gradebook",
  },
  {
    component: Schedule,
    name: "Schedules",
  },
  {
    component: AttachFile,
    name: "Admin Documents",
  },
  {
    component: AutoGraph,
    name: "Statistics",
    route: "/stats",
  },
];

export const MenuDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const toggleDrawer = (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" || (event as KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const drawerItemList = () => {
    return (
      <Box
        role="presentation"
        sx={{
          bgcolor: lightPrimaryColor,
          color: "white",
          width: DRAWER_WIDTH,
        }}
      >
        <img alt="CCM Logo" src="./assets/ccm-logo.png" width={DRAWER_WIDTH} />
        <List>
          {drawerList.map((item) => {
            return (
              <Box
                key={item.name}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.mode === "light" ? "primary.dark" : undefined,
                    opacity: [0.9, 0.8, 0.7],
                  },
                  marginTop: DRAWER_ITEM_MARGIN,
                }}
              >
                <ListItem
                  button
                  onClick={() => {
                    item.route && navigate(item.route);
                    setIsOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <item.component {...iconProps} />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <Divider />
                </ListItem>
              </Box>
            );
          })}
        </List>
      </Box>
    );
  };

  return (
    <Box>
      <Tooltip arrow title="Menu">
        <IconButton color="inherit" edge="start" onClick={toggleDrawer} size="large">
          <Menu />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="left"
        onClose={toggleDrawer}
        open={isOpen}
        PaperProps={{
          sx: {
            flexDirection: "row",
          },
        }}
      >
        {drawerItemList()}
      </Drawer>
    </Box>
  );
};
