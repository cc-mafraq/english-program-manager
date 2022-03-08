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
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React, { KeyboardEvent, MouseEvent, useState } from "react";

const DRAWER_WIDTH = 250;
const DRAWER_ITEM_MARGIN = "0.87vh";

interface DrawerListItem {
  component: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, "svg">> & {
    muiName: string;
  };
  name: string;
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
  },
];

export const MenuDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          bgcolor: "primary.main",
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
                    backgroundColor: "primary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                  marginTop: DRAWER_ITEM_MARGIN,
                }}
              >
                <ListItem button>
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