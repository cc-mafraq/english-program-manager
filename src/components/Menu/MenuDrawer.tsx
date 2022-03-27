import AttachFileIcon from "@mui/icons-material/AttachFile";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CreateIcon from "@mui/icons-material/Create";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
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
    component: HomeIcon,
    name: "Home",
  },
  {
    component: LibraryBooksIcon,
    name: "Virtual Library",
  },
  {
    component: PersonIcon,
    name: "Student Database",
    route: "/epd",
  },
  {
    component: FormatListBulletedIcon,
    name: "Class Lists",
  },
  {
    component: CreateIcon,
    name: "Attendance",
  },
  {
    component: EqualizerIcon,
    name: "Gradebook",
  },
  {
    component: ScheduleIcon,
    name: "Schedules",
  },
  {
    component: AttachFileIcon,
    name: "Admin Documents",
  },
  {
    component: AutoGraphIcon,
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
      <IconButton color="inherit" edge="start" onClick={toggleDrawer} size="large">
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" onClose={toggleDrawer} open={isOpen}>
        {drawerItemList()}
      </Drawer>
    </Box>
  );
};
