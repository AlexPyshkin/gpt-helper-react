import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
  Divider,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/library';
      navigate(from);
    } catch (err) {
      setError(t('auth.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google OAuth response:', credentialResponse);
    
    if (!credentialResponse?.credential) {
      console.error('No credential in Google response');
      setError(t('auth.error'));
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      console.log('Attempting to login with Google credential');
      await login('google', credentialResponse.credential);
      console.log('Google login successful');
      const from = location.state?.from?.pathname || '/library';
      navigate(from);
    } catch (err) {
      console.error('Google login error:', err);
      setError(t('auth.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Google OAuth error:', error);
    setError(t('auth.error'));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.paper',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {t('auth.login')}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('auth.email')}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('auth.password')}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? t('common.loading') : t('auth.login')}
          </Button>
          <Divider sx={{ my: 2 }}>{t('common.or')}</Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => handleGoogleError(new Error('Google OAuth failed'))}
              useOneTap={false}
            />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/register" variant="body2" sx={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
              {t('auth.noAccount')}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}; 