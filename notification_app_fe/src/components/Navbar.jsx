import React from 'react';
import { AppBar, Toolbar, Typography, Badge, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          AffordMed Campus
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal', borderBottom: location.pathname === '/' ? '2px solid white' : 'none', borderRadius: 0 }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority"
            sx={{ fontWeight: location.pathname === '/priority' ? 'bold' : 'normal', borderBottom: location.pathname === '/priority' ? '2px solid white' : 'none', borderRadius: 0 }}
          >
            Priority Inbox
          </Button>
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
