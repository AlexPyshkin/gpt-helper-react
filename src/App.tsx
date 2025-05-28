import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Library } from './components/library/Library';
import { Dialog } from './components/dialog/Dialog';
import { Typography, Box } from '@mui/material';
import { Footer } from './components/Footer';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import './App.css';
import { AppProvider } from './context/AppContext';
import { AppDrawer } from './components/common/AppDrawer';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function AppContent() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dialog"
          element={
            <ProtectedRoute>
              <Dialog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Typography variant="h5" sx={{ padding: 2, height: '89vh' }}>
              Добро пожаловать в GPT Helper!
            </Typography>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
    >
      <AuthProvider>
        <AppProvider>
          <Box sx={{ display: "flex" }}>
            <AppDrawer />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <AppContent />
            </Box>
          </Box>
        </AppProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
