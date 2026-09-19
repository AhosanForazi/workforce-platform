import axios from 'axios';

let rawURL = import.meta.env.VITE_API_URL || '/api';
if (rawURL && typeof rawURL === 'string' && rawURL.startsWith('http')) {
  rawURL = rawURL.replace(/\/+$/, '');
  if (!rawURL.endsWith('/api')) {
    rawURL += '/api';
  }
}

const api = axios.create({
  baseURL: rawURL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('wf_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore invalid json
    }
  }
  return config;
});

export default api;
