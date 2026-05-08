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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" py={4}>
      <Card elevation={3} sx={{ maxWidth: 700, width: '100%', p: 2 }}>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" mb={1} color="primary" fontWeight="bold">
              Account Login
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Enter your credentials to access the assessment.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
              {Object.keys(formData).map(key => (
                <TextField 
                  key={key} 
                  fullWidth 
                  label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} 
                  name={key} 
                  type={key.includes('Secret') ? 'password' : 'text'} 
                  margin="none" 
                  size="small"
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })} 
                  required 
                  sx={{ ...(key === 'clientSecret' || key === 'clientID' ? { gridColumn: '1 / -1' } : {}) }}
                />
              ))}
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.2 }}>
              Authorize
            </Button>
            <Box textAlign="center" mt={2}>
              <Link component={RouterLink} to="/register" variant="body2" sx={{ textDecoration: 'none' }}>
                Need an account? Register here
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
