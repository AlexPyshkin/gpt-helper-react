import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from 'react-i18next';

export const AppDrawer = () => {
  const { state, dispatch } = useAppContext();
  const { isAuthenticated, user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

  const handleEditModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FILTERS', payload: { editMode: event.target.checked } });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerOpen ? 240 : 48,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerOpen ? 240 : 48,
          boxSizing: 'border-box',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: drawerOpen ? 'space-between' : 'center',
        p: 1,
        minHeight: '48px'
      }}>
        {drawerOpen && (
          <Typography variant="subtitle2" sx={{ ml: 1 }}>
            {t('common.settings')}
          </Typography>
        )}
        <IconButton 
          onClick={() => setDrawerOpen(!drawerOpen)}
          size="small"
          sx={{ p: 0.5 }}
        >
          {drawerOpen ? <MenuIcon fontSize="small" /> : <SettingsIcon fontSize="small" />}
        </IconButton>
      </Box>
      <Divider />
      {drawerOpen && (
        <Box sx={{ p: 2 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText 
                primary={user?.name || t('common.guest')} 
                secondary={user?.email}
              />
            </ListItem>
            <ListItemButton onClick={toggleLanguage}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText 
                primary={language === 'ru' ? 'Русский' : 'English'} 
                secondary={t('common.language')}
              />
            </ListItemButton>
          </List>
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={state.filters.editMode}
                onChange={handleEditModeChange}
                color="primary"
                size="small"
              />
            }
            label={t('library.editMode')}
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
              },
            }}
          />
        </Box>
      )}
    </Drawer>
  );
}; 