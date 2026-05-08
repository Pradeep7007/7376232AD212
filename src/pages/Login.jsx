import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert } from '@mui/material';
import apiClient from '../logging_middleware/apiClient';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', name: '', rollNumber: '', clientID: '', clientSecret: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/auth', formData);
      localStorage.setItem('access_token', data.access_token);
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 500, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" mb={2}>Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map(key => (
              <TextField key={key} fullWidth label={key} name={key} type={key.includes('Secret') ? 'password' : 'text'} margin="normal" onChange={e => setFormData({ ...formData, [key]: e.target.value })} required />
            ))}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
            <Link component={RouterLink} to="/register" display="block" textAlign="center" mt={2}>Register here</Link>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
