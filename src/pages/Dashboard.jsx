import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Radio, RadioGroup, FormControlLabel, Grid, Paper } from '@mui/material';
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
    <Box sx={{ mt: 3, mb: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} mb={3} bgcolor="#fff" borderRadius={2} boxShadow={1}>
        <Typography variant="h6" fontWeight="bold" color="textPrimary">Assessment Dashboard</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon color={isUrgent ? 'error' : 'action'} />
          <Typography variant="h6" color={isUrgent ? 'error.main' : 'textPrimary'}>
            {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">Question Navigator</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {questions.map((q, i) => (
                <Button 
                  key={q.id} 
                  variant={idx === i ? 'contained' : answers[q.id] ? 'contained' : 'outlined'} 
                  color={idx === i ? 'primary' : answers[q.id] ? 'success' : 'inherit'}
                  onClick={() => setQData({ ...qData, idx: i })}
                  sx={{ minWidth: '40px', height: '40px', borderRadius: 1 }}
                >
                  {i + 1}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Card elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: '350px' }}>
            <Box mb={3}>
              <Typography variant="subtitle2" color="textSecondary" mb={1}>Question {idx + 1} of {questions.length}</Typography>
              <Typography variant="h6" fontWeight="normal">{currentQ.text}</Typography>
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
                  label={<Typography variant="body1">{opt}</Typography>} 
                  sx={{ 
                    mb: 1, 
                    p: 1, 
                    borderRadius: 1, 
                    border: '1px solid #e0e0e0', 
                    backgroundColor: answers[currentQ.id] === opt ? '#f0f7ff' : 'transparent'
                  }}
                />
              ))}
            </RadioGroup>

            <Box mt={4} pt={2} borderTop="1px solid #e0e0e0" display="flex" justifyContent="space-between">
              <Button variant="outlined" disabled={idx === 0} onClick={() => setQData({ ...qData, idx: idx - 1 })}>
                Previous
              </Button>
              {idx < questions.length - 1 ? (
                <Button variant="contained" color="primary" onClick={() => setQData({ ...qData, idx: idx + 1 })}>
                  Save & Next
                </Button>
              ) : (
                <Button variant="contained" color="error" onClick={handleSubmit}>
                  Submit Test
                </Button>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
