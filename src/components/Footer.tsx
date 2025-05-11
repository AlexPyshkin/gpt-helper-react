import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box 
      sx={{ 
        backgroundColor: '#f8f8f8', 
        padding: '6px',
        textAlign: 'center' 
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Alexandr Pyshkin Inc. All rights reserved. Contact: <a href="mailto:alex.pyshkin.91.dev@gmail.com">alex.pyshkin.91.dev@gmail.com</a>
      </Typography>
    </Box>
  );
}; 