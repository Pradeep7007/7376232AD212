import axios from 'axios';

const apiClient = axios.create({ baseURL: 'http://localhost:5000' });

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token && !['/register', '/auth'].includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.metadata = { startTime: Date.now() };
  return config;
});

const log = (response, error) => {
  const config = response?.config || error?.config;
  const status = response?.status || error?.response?.status || 500;
  if (!config) return;
  const latencyMs = Date.now() - (config.metadata?.startTime || Date.now());
  
  fetch('http://localhost:5000/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { endpoint: config.url, 
        status, latencyMs, 
        timestamp: new Date().toISOString()
      }),
    keepalive: true,
  }).catch(() => {});
};

apiClient.interceptors.response.use(
  res => {
    log(res, null);
    return res;
  },
  err => {
    log(null, err);
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiClient;
