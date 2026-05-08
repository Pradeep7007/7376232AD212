import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Radio, RadioGroup, FormControlLabel, Grid, Paper, Fade } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import apiClient from '../logging_middleware/apiClient';

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState(3600);
  const [qData, setQData] = useState({ questions: [], idx: 0, answers: {} });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) return navigate('/login');
    apiClient.get('/questions').then(r => setQData(p => ({ ...p, questions: r.data }))).catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return handleSubmit();
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const handleSubmit = async () => {
    await apiClient.post('/submit', { answers: qData.answers });
    navigate('/results');
  };

  const { questions, idx, answers } = qData;
  if (!questions.length) return null;
  const currentQ = questions[idx];
  const isUrgent = timeLeft < 300;

  return (
    <Box className="animate-fade-in" sx={{ mt: 2 }}>
      <Box className="glass-card" display="flex" justifyContent="space-between" alignItems="center" p={2} mb={4}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>Assessment Dashboard</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon color={isUrgent ? 'error' : 'primary'} />
          <Typography variant="h5" color={isUrgent ? 'error.main' : 'primary.main'} fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
            {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper className="glass-card" sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" mb={2} color="textSecondary">Questions Navigator</Typography>
            <Box display="flex" gap={1.5} flexWrap="wrap">
              {questions.map((q, i) => (
                <Button 
                  key={q.id} 
                  variant={idx === i ? 'contained' : answers[q.id] ? 'contained' : 'outlined'} 
                  color={idx === i ? 'primary' : answers[q.id] ? 'success' : 'inherit'}
                  onClick={() => setQData({ ...qData, idx: i })}
                  sx={{ 
                    minWidth: '45px', 
                    height: '45px', 
                    borderRadius: '50%',
                    boxShadow: idx === i ? '0 0 15px rgba(0,229,255,0.6)' : 'none'
                  }}
                >
                  {i + 1}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Fade in={true} key={idx}>
            <Card className="glass-card" sx={{ p: 4, minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" mb={1} fontWeight="bold">Question {idx + 1} of {questions.length}</Typography>
                <Typography variant="h5" sx={{ lineHeight: 1.6 }}>{currentQ.text}</Typography>
              </Box>

              <RadioGroup 
                value={answers[currentQ.id] || ''} 
                onChange={e => setQData({ ...qData, answers: { ...answers, [currentQ.id]: e.target.value } })}
                sx={{ flexGrow: 1 }}
              >
                {currentQ.options.map(opt => (
                  <FormControlLabel 
                    key={opt} 
                    value={opt} 
                    control={<Radio color="primary" />} 
                    label={<Typography variant="body1" sx={{ ml: 1, py: 1 }}>{opt}</Typography>} 
                    sx={{ 
                      mb: 2, 
                      p: 1, 
                      borderRadius: 2, 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: answers[currentQ.id] === opt ? 'rgba(0,229,255,0.1)' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                    }}
                  />
                ))}
              </RadioGroup>

              <Box mt={4} pt={3} borderTop="1px solid rgba(255,255,255,0.1)" display="flex" justifyContent="space-between">
                <Button variant="outlined" disabled={idx === 0} onClick={() => setQData({ ...qData, idx: idx - 1 })} sx={{ px: 4 }}>
                  Previous
                </Button>
                {idx < questions.length - 1 ? (
                  <Button variant="contained" className="btn-glow" onClick={() => setQData({ ...qData, idx: idx + 1 })} sx={{ px: 4 }}>
                    Save & Next
                  </Button>
                ) : (
                  <Button variant="contained" color="secondary" className="btn-glow" onClick={handleSubmit} sx={{ px: 4, boxShadow: '0 4px 14px 0 rgba(245,0,87,0.4)' }}>
                    Submit Assessment
                  </Button>
                )}
              </Box>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}
