import MenuIcon from '@mui/icons-material/Menu';
import {
  alpha,
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { UserRole } from 'enums';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from 'stores';

const drawerWidth = 240;

const guessItems = [
  {
    name: 'Home',
    url: '/',
  },
];

const userItems = [
  {
    name: 'Orders',
    url: '/orders',
  },
];

const adminItems = [
  {
    name: 'Users',
    url: '/users',
  },
];

const employeeItems = [
  {
    name: 'Manage cars',
    url: '/manage-cars',
  },
];

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((store) => store.user);

  const content = [...guessItems];

  switch (user?.role) {
    case UserRole.admin: {
      content.push(...adminItems, ...employeeItems, ...userItems);
      break;
    }
    case UserRole.employee: {
      content.push(...employeeItems, ...userItems);
      break;
    }
    case UserRole.user: {
      content.push(...userItems);
      break;
    }
  }

  if (user === undefined) {
    content.push(
      {
        name: 'Login',
        url: '/auth/login',
      },
      {
        name: 'Sign Up',
        url: '/auth/signup',
      }
    );
  } else {
    content.push({
      name: 'Log out',
      url: '/auth/logout',
    });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography width="100%" variant="h6" align="center">
          Rental App
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {content.map((x) => (
          <ListItem
            key={x.name}
            disablePadding
            component={NavLink}
            to={x.url}
            sx={{
              color: 'text.primary',
              '&.active': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                borderRight: '3px solid',
                '& .MuiSvgIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemButton>
              <ListItemText primary={x.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxWidth: 1100,
          margin: 'auto',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
