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
       setError(err.response?.data?.message || 'Error'); }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 700, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" mb={2}>Register</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {!credentials ? (

            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map(key => (
                <TextField key={key} 
                fullWidth label={key} 
                name={key} 
                margin="normal" 
                onChange={e => setFormData({ ...formData, [key]: e.target.value })} required />
              ))}

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
              <Link component={RouterLink} to="/login" display="block" textAlign="center" mt={2}>Login here</Link>
            </form>
          ) : (
            <Box>
              <Alert severity="success">Success! Save these:</Alert>
              <TextField fullWidth label="Client ID" value={credentials.clientID} margin="normal" InputProps={{ readOnly: true }} />
              <TextField fullWidth label="Client Secret" value={credentials.clientSecret} margin="normal" InputProps={{ readOnly: true }} />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>Login</Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
