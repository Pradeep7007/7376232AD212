import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Chip, Divider, List, ListItem, Fade, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import apiClient from '../logging_middleware/apiClient';

export default function Results() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) return navigate('/login');
    apiClient.get('/results').then(r => setData(r.data)).catch(() => navigate('/login'));
  }, [navigate]);

  if (!data) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress color="primary" /></Box>;

  const getBadgeProps = (pct) => {
    if (pct >= 85) return { color: 'success', label: 'Exceptional Performance', shadow: 'rgba(76, 175, 80, 0.4)' };
    if (pct >= 56) return { color: 'warning', label: 'Solid Effort', shadow: 'rgba(255, 152, 0, 0.4)' };
    return { color: 'error', label: 'Needs Improvement', shadow: 'rgba(244, 67, 54, 0.4)' };
  };

  const badge = getBadgeProps(data.percentage);

  return (
    <Box display="flex" justifyContent="center" className="animate-fade-in" py={4}>
      <Card className="glass-card" sx={{ maxWidth: 800, width: '100%', p: 5 }}>
        <Typography variant="h3" align="center" fontWeight="bold" sx={{ color: '#fff', mb: 1 }}>Assessment Results</Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" mb={4}>Detailed breakdown of your performance.</Typography>
        
        <Box textAlign="center" my={5} p={4} sx={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: badge.shadow, filter: 'blur(50px)', borderRadius: '50%' }} />
          <Typography variant="h1" fontWeight="900" sx={{ color: `${badge.color}.main`, textShadow: `0 0 20px ${badge.shadow}` }}>
            {data.score} <Typography component="span" variant="h3" color="textSecondary">/ {data.total}</Typography>
          </Typography>
          <Typography variant="h6" mt={1} color="textSecondary">Final Score: {data.percentage}%</Typography>
          <Chip 
            label={badge.label} 
            color={badge.color} 
            sx={{ mt: 3, px: 3, py: 2.5, fontSize: '1.1rem', fontWeight: 'bold', boxShadow: `0 4px 15px ${badge.shadow}` }} 
          />
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Typography variant="h5" mb={3} fontWeight="bold">Question Drill-Down</Typography>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.drillDown.map((item, i) => (
            <Fade in={true} style={{ transitionDelay: `${i * 100}ms` }} key={i}>
              <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', borderRadius: 2, p: 3, borderLeft: `4px solid ${item.isCorrect ? '#4caf50' : '#f44336'}` }}>
                <Box display="flex" alignItems="flex-start" gap={1.5} mb={2}>
                  {item.isCorrect ? <CheckCircleIcon color="success" sx={{ mt: 0.3 }} /> : <CancelIcon color="error" sx={{ mt: 0.3 }} />}
                  <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.4 }}>Q{i + 1}: {item.questionText}</Typography>
                </Box>
                <Box pl={4.5} width="100%">
                  <Typography variant="body1" sx={{ color: item.isCorrect ? 'success.light' : 'error.light', mb: item.isCorrect ? 0 : 1 }}>
                    <strong>Your Answer:</strong> {item.userAnswer || 'Not answered'}
                  </Typography>
                  {!item.isCorrect && (
                    <Typography variant="body1" color="textSecondary">
                      <strong>Correct Answer:</strong> {item.correctAnswer}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            </Fade>
          ))}
        </List>
        
        <Box mt={6} textAlign="center">
          <Button variant="outlined" size="large" sx={{ px: 5, py: 1.5, borderColor: 'rgba(255,255,255,0.3)', color: '#fff', '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.05)' } }} onClick={() => { localStorage.clear(); navigate('/login'); }}>
            Logout & Exit
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
