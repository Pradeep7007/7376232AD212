import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert } from '@mui/material';
import apiClient from '../logging_middleware/apiClient';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', rollNumber: '', github: '', mobile: '', accessCode: '' });
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/register', formData);
      setCredentials(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" py={4}>
      <Card elevation={3} sx={{ maxWidth: 700, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" mb={1} color="primary" fontWeight="bold">
            Registration Form
          </Typography>
          <Typography variant="body2" align="center" mb={3} color="textSecondary">
            Please fill out all fields to generate your credentials.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          {!credentials ? (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                {Object.keys(formData).map(key => (
                  <TextField 
                    key={key} 
                    fullWidth 
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} 
                    name={key} 
                    margin="none" 
                    size="small"
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })} 
                    required 
                  />
                ))}
              </Box>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.2 }}>
                Register
              </Button>
              <Box textAlign="center" mt={2}>
                <Link component={RouterLink} to="/login" variant="body2" sx={{ textDecoration: 'none' }}>
                  Already have an account? Login here
                </Link>
              </Box>
            </form>
          ) : (
            <Box textAlign="center">
              <Alert severity="success" sx={{ mb: 3 }}>Registration Successful! Please save the details below securely.</Alert>
              <TextField fullWidth label="Client ID" value={credentials.clientID} margin="normal" InputProps={{ readOnly: true }} />
              <TextField fullWidth label="Client Secret" value={credentials.clientSecret} margin="normal" InputProps={{ readOnly: true }} />
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.2 }} onClick={() => navigate('/login')}>
                Proceed to Login
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
