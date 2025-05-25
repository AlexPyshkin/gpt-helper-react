import { styled } from '@mui/material/styles';
import TextareaAutosize from '@mui/material/TextareaAutosize';

export const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#ffffff',
  color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'}`,
  '&:hover': {
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'}`,
  },
  '&:focus': {
    outline: 'none',
    border: `2px solid ${theme.palette.primary.main}`,
  },
})); 