import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Login, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import reactLogo from '/src/assets/react.svg';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img 
              src={reactLogo}
              alt="Logo" 
              style={{ height: '40px', marginRight: '16px' }} 
            />
            <Typography variant="h6" component="div">
              GPT Helper
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginRight: 2 }}>
          <Button color="inherit" component={Link} to="/library">
            Библиотека
          </Button>
          <Button color="inherit" component={Link} to="/dialog">
            Диалог
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
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
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              startIcon={<Login />}
            >
              Войти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
