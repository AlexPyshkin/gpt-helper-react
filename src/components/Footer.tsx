import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <Box 
      sx={{ 
        backgroundColor: 'background.paper',
        padding: '6px',
        textAlign: 'center' 
      }}
    >
      <Typography variant="body2" color="textSecondary">
        {t('footer.copyright')} Contact: <a href="mailto:alex.pyshkin.91.dev@gmail.com">alex.pyshkin.91.dev@gmail.com</a>
      </Typography>
    </Box>
  );
}; 