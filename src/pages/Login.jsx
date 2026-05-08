import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert, Fade } from '@mui/material';
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" className="animate-fade-in">
      <Card className="glass-card" sx={{ maxWidth: 700, width: '100%', p: 3, mb: 4 }}>
        <CardContent>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" mb={1} color="primary" sx={{ textShadow: '0 2px 10px rgba(0,229,255,0.3)' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Authenticate to access your assessment dashboard.
            </Typography>
          </Box>

          {error && <Fade in={!!error}><Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert></Fade>}
          
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
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })} 
                  required 
                  sx={{ ...(key === 'clientSecret' || key === 'clientID' ? { gridColumn: '1 / -1' } : {}), mb: 1 }}
                />
              ))}
            </Box>
            <Button type="submit" variant="contained" className="btn-glow" fullWidth sx={{ mt: 4, py: 1.5, fontSize: '1.1rem' }}>
              Authorize & Enter
            </Button>
            <Box textAlign="center" mt={3}>
              <Link component={RouterLink} to="/register" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Need an account? Register here
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
