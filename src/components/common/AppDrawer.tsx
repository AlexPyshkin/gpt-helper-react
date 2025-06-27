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
  Button,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from 'react-i18next';

export const AppDrawer = () => {
  const { state, dispatch } = useAppContext();
  const { isAuthenticated, user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation();

  const handleEditModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FILTERS', payload: { editMode: event.target.checked } });
  };

  const handleClearFilter = () => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { tagFilter: '' } 
    });
  };

  const handleApplyFilter = () => {
    dispatch({ 
      type: 'APPLY_FILTERS', 
      payload: { tagFilter: state.filters.tagFilter } 
    });
  };

  const handleTagFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { tagFilter: event.target.value } 
    });
  };

  const handleSave = () => {
    // For now, just log the value
    console.log('Saved:', { inputValue });
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

          {/* Tag Filter Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('common.tagFilter')}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={state.filters.tagFilter || ''}
              onChange={handleTagFilterChange}
              placeholder={t('common.enterTag')}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearFilter}
                disabled={!state.filters.tagFilter}
                fullWidth
              >
                {t('common.clear')}
              </Button>
              <Button
                size="small"
                startIcon={<FilterListIcon />}
                onClick={handleApplyFilter}
                disabled={!state.filters.tagFilter}
                fullWidth
                variant="contained"
              >
                {t('common.apply')}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      {/* Collapsible block at the bottom */}
      {drawerOpen && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          borderTop: '1px solid #eee',
          background: 'background.paper',
          zIndex: 1,
        }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              px: 2,
              py: 1,
              userSelect: 'none',
            }}
            onClick={() => setCollapsibleOpen((prev) => !prev)}
          >
            <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
              {t('common.newCategory') || 'Новая категория'}
            </Typography>
            {collapsibleOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </Box>
          <Collapse in={collapsibleOpen} timeout="auto" unmountOnExit>
            <Box sx={{ px: 2, py: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={t('common.enterText') || 'Enter text'}
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={handleSave}
              >
                {t('common.add') || 'Добавить'}
              </Button>
            </Box>
          </Collapse>
        </Box>
      )}
    </Drawer>
  );
}; 