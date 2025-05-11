import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { AccountCircle, Login } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import reactLogo from '/src/assets/react.svg';

export const Header = () => {
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

        <Box>
          <IconButton color="inherit" aria-label="account">
            <AccountCircle />
          </IconButton>
          <IconButton color="inherit" aria-label="login">
            <Login />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
