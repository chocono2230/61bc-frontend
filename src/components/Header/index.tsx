import { useState, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { UserContext } from '../../Top';

const Hander = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);
  const user = useContext(UserContext);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Typography variant='h6' noWrap sx={{ m: 1 }}>
        {user?.displayName}
      </Typography>
      <MenuItem onClick={signOut}>
        <IconButton size='medium' color='inherit'>
          <ExitToAppIcon />
        </IconButton>
        <Typography variant='body1' noWrap sx={{ m: 1 }}>
          SignOut
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar />
      <AppBar>
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            Kanreki
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: 'flex' } }}>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
};

export default Hander;
