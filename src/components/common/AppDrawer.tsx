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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../contexts/AuthContext";

export const AppDrawer = () => {
  const { state, dispatch } = useAppContext();
  const { isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            Настройки
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
                primary={state.user?.username || 'Гость'} 
                secondary="Пользователь"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Русский" 
                secondary="Язык"
              />
            </ListItem>
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
            label="Режим редактирования"
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