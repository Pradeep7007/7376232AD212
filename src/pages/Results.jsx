import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Chip, Divider, List, ListItem } from '@mui/material';
import apiClient from '../logging_middleware/apiClient';

export default function Results() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) return navigate('/login');
    apiClient.get('/results').then(r => setData(r.data)).catch(() => navigate('/login'));
  }, [navigate]);

  if (!data) return null;

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 800, width: '100%', p: 3 }}>
        <Typography variant="h4" align="center">Results</Typography>
        <Box textAlign="center" my={3}>
          <Typography variant="h3" color="primary">{data.score}/{data.total}</Typography>
          <Chip label={`${data.percentage}%`} color={data.percentage >= 85 ? 'success' : data.percentage >= 56 ? 'warning' : 'error'} sx={{ mt: 1, p: 2, fontSize: '1.2rem' }} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          {data.drillDown.map((item, i) => (
            <ListItem key={i} divider sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography fontWeight="bold">Q{i + 1}: {item.questionText}</Typography>
              <Typography color={item.isCorrect ? 'success.main' : 'error.main'}>Your Answer: {item.userAnswer || 'None'}</Typography>
              {!item.isCorrect && <Typography color="textSecondary">Correct: {item.correctAnswer}</Typography>}
            </ListItem>
          ))}
        </List>
        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => { localStorage.clear(); navigate('/login'); }}>Exit</Button>
      </Card>
    </Box>
  );
}
