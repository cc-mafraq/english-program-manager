import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Person';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CreateIcon from '@mui/icons-material/Create';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState, KeyboardEvent, MouseEvent } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

const DRAWER_WIDTH = 250;
const DRAWER_ITEM_MARGIN = '1.4vh';

interface DrawerListItem {
  name: string;
  component: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
}

const iconProps = { style: { color: 'white' } };
const drawerList: DrawerListItem[] = [
  {
    name: 'Home',
    component: HomeIcon,
  },
  {
    name: 'Virtual Library',
    component: LibraryBooksIcon,
  },
  {
    name: 'Student Database',
    component: PersonIcon,
  },
  {
    name: 'Class Lists',
    component: FormatListBulletedIcon,
  },
  {
    name: 'Attendance',
    component: CreateIcon,
  },
  {
    name: 'Gradebook',
    component: EqualizerIcon,
  },
  {
    name: 'Schedules',
    component: ScheduleIcon,
  },
  {
    name: 'Admin Documents',
    component: AttachFileIcon,
  },
  {
    name: 'Statistics',
    component: AutoGraphIcon,
  },
];

export const MenuDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' ||
        (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const drawerItemList = () => (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        bgcolor: 'primary.main',
        color: 'white',
      }}
      role="presentation"
    >
      <img src="/ccm-logo.PNG" width={DRAWER_WIDTH} />
      <List>
        {drawerList.map((item) => (
          <Box
            sx={{
              '&:hover': {
                backgroundColor: 'primary.dark',
                opacity: [0.9, 0.8, 0.7],
              },
              marginTop: DRAWER_ITEM_MARGIN,
            }}
            key={item.name}
          >
            <ListItem button>
              <ListItemIcon>
                <item.component {...iconProps} />
              </ListItemIcon>
              <ListItemText primary={item.name} />
              <Divider />
            </ListItem>
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      <IconButton
        size="large"
        edge="start"
        color="primary"
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        {drawerItemList()}
      </Drawer>
    </Box>
  );
};
