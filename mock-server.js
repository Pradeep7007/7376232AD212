import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const clients = {}, validTokens = new Set();
let latestResults = null;

const questionsDB = [
  { id: 'q1', text: "What is the primary function of a logging middleware?", options: ["Data Storage", "Tracking Requests", "Styling UI", "Routing"], correctAnswer: "Tracking Requests" },
  { id: 'q2', text: "Explain the purpose of an Axios interceptor.", options: ["Modifying requests/responses globally", "Connecting to a database", "Rendering components", "Running unit tests"], correctAnswer: "Modifying requests/responses globally" },
  { id: 'q3', text: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useMemo", "useContext"], correctAnswer: "useEffect" }
];

app.post('/register', (req, res) => {
  const { name, email, rollNumber, github, mobile, accessCode } = req.body;
  if (!name || !email || !rollNumber || !github || !mobile || !accessCode) 
    return res.status(400).json({ message: 'All fields required' });

  const clientID = 'client_'+Math.random(10000);
  const clientSecret = 'secret_'+Math.random(10000);

  clients[clientID] = { clientSecret, email, name, rollNumber };
  res.json({ clientID, clientSecret });
});

app.post('/auth', (req, res) => {
  const { clientID, clientSecret } = req.body;
  if (clients[clientID]?.clientSecret === clientSecret) {
    const token = 'token_' + Math.random().toString(36).substr(2, 20);
    validTokens.add(token);
    res.json({ access_token: token });
  } else res.status(401).json({ message: 'Invalid credentials' });
});

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token && validTokens.has(token)) next();
  else res.sendStatus(401);
};

app.get('/questions', auth, (req, res) => res.json(questionsDB.map(({ id, text, options }) => ({ id, text, options }))));

app.post('/submit', auth, (req, res) => {
  const { answers } = req.body;
  let score = 0;
  const drillDown = questionsDB.map(q => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) score++;
    return { questionId: q.id, questionText: q.text, userAnswer: answers[q.id], correctAnswer: q.correctAnswer, isCorrect };
  });
  latestResults = { score, total: questionsDB.length, percentage: Math.round((score / questionsDB.length) * 100), drillDown };
  res.json({ message: "Test submitted" });
});

app.get('/results', auth, (req, res) => latestResults ? res.json(latestResults) : res.status(404).json({ message: 'No results' }));
app.post('/logs', (req, res) => { console.log('LOG:', req.body); res.sendStatus(200); });

app.listen(5000, () => console.log('Mock server on 5000'));
