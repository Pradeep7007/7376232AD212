import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';

export default function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Container>
  );
}
