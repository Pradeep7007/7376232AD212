import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert, Fade } from '@mui/material';
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" className="animate-fade-in">
      <Card className="glass-card" sx={{ maxWidth: 700, width: '100%', p: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h4" align="center" mb={1} color="primary" sx={{ textShadow: '0 2px 10px rgba(0,229,255,0.3)' }}>
            Join the Program
          </Typography>
          <Typography variant="body1" align="center" mb={4} color="textSecondary">
            Enter your details to get your unique credentials.
          </Typography>

          {error && <Fade in={!!error}><Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert></Fade>}
          
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
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })} 
                    required 
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
              <Button type="submit" variant="contained" className="btn-glow" fullWidth sx={{ mt: 4, py: 1.5, fontSize: '1.1rem' }}>
                Register Now
              </Button>
              <Box textAlign="center" mt={3}>
                <Link component={RouterLink} to="/login" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Already have an account? Login here
                </Link>
              </Box>
            </form>
          ) : (
            <Fade in={true}>
              <Box textAlign="center">
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Registration Successful! Save these details securely.</Alert>
                <TextField fullWidth label="Client ID" value={credentials.clientID} margin="normal" InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
                <TextField fullWidth label="Client Secret" value={credentials.clientSecret} margin="normal" InputProps={{ readOnly: true }} />
                <Button variant="contained" color="secondary" className="btn-glow" fullWidth sx={{ mt: 4, py: 1.5 }} onClick={() => navigate('/login')}>
                  Proceed to Login
                </Button>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
