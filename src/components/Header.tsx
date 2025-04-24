import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { AccountCircle, Login } from '@mui/icons-material';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src="/src/assets/react.svg" 
            alt="Logo" 
            style={{ height: '40px', marginRight: '16px' }} 
          />
          <Typography variant="h6" component="div">
            GPT Helper
          </Typography>
        </Box>

        {/* Right-side buttons */}
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