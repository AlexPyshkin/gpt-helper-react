import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { Box } from '@mui/material';

const MarkdownWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  height: '100%',
  '& .markdown-body': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'transparent',
    color: theme.palette.text.primary,
  },
  '& > *': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : 'transparent',
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: theme.palette.text.primary,
    marginTop: '1.5em',
    marginBottom: '0.5em',
  },
  '& h1': {
    fontSize: '2em',
  },
  '& h2': {
    fontSize: '1.5em',
  },
  '& h3': {
    fontSize: '1.25em',
  },
  '& p': {
    marginTop: '0.5em',
    marginBottom: '0.5em',
    color: theme.palette.text.primary,
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& ul, & ol': {
    paddingLeft: '2em',
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },
  '& li': {
    marginBottom: '0.25em',
    color: theme.palette.text.primary,
  },
  '& code': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
    padding: '0.2em 0.4em',
    borderRadius: '3px',
    fontSize: '0.9em',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
    padding: '1em',
    borderRadius: '4px',
    overflow: 'auto',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'}`,
    margin: '1em 0',
    padding: '0.5em 1em',
    color: theme.palette.text.secondary,
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
  '& table': {
    borderCollapse: 'collapse',
    width: '100%',
    margin: '1em 0',
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: '0.5em',
    textAlign: 'left',
  },
  '& th': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
  },
}));

interface StyledReactMarkdownProps {
  children: string;
}

export const StyledReactMarkdown = ({ children }: StyledReactMarkdownProps) => {
  return (
    <MarkdownWrapper>
      <ReactMarkdown>{children}</ReactMarkdown>
    </MarkdownWrapper>
  );
}; 