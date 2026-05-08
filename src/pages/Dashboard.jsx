import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Radio, RadioGroup, FormControlLabel, Grid, Paper } from '@mui/material';
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Test</Typography>
        <Typography variant="h5" color={timeLeft < 300 ? 'error' : 'primary'}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {questions.map((q, i) => (
              <Button key={q.id} variant={idx === i ? 'contained' : answers[q.id] ? 'outlined' : 'text'} onClick={() => setQData({ ...qData, idx: i })}>
                {i + 1}
              </Button>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Q{idx + 1}: {currentQ.text}</Typography>
            <RadioGroup value={answers[currentQ.id] || ''} onChange={e => setQData({ ...qData, answers: { ...answers, [currentQ.id]: e.target.value } })}>
              {currentQ.options.map(opt => <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />)}
            </RadioGroup>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button disabled={idx === 0} onClick={() => setQData({ ...qData, idx: idx - 1 })}>Prev</Button>
              {idx < questions.length - 1 ? <Button variant="contained" onClick={() => setQData({ ...qData, idx: idx + 1 })}>Next</Button> : <Button variant="contained" color="error" onClick={handleSubmit}>Submit</Button>}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
