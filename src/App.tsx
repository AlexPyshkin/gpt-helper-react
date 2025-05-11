import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Library } from './components/library/Library';
import { Dialog } from './components/dialog/Dialog';
import { Typography } from '@mui/material';
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/library" element={<Library />} />
        <Route path="/dialog" element={<Dialog />} />
        <Route
          path="/"
          element={
            <Typography variant="h5" sx={{ padding: 2 }}>
              Добро пожаловать в GPT Helper!
            </Typography>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
