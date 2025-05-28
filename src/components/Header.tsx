import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Login, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import reactLogo from '/src/assets/react.svg';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ minHeight: '48px' }}>
      <Toolbar sx={{ minHeight: '48px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img 
              src={reactLogo}
              alt="Logo" 
              style={{ height: '28px', marginRight: '12px' }} 
            />
            <Typography variant="subtitle1" component="div">
              {t('header.appName')}
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, marginRight: 1 }}>
          <Button color="inherit" component={Link} to="/library" size="small">
            {t('header.library')}
          </Button>
          <Button color="inherit" component={Link} to="/dialog" size="small">
            {t('header.dialog')}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton color="inherit" onClick={toggleTheme} size="small">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          {isAuthenticated ? (
            <>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>{user?.email}</MenuItem>
                <MenuItem onClick={handleLogout}>{t('header.logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              startIcon={<Login />}
              size="small"
            >
              {t('header.login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
