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
  timeout: 15000, // 15s timeout to prevent infinite spinners
  headers: {
    Accept: 'application/json',
  },
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

// Response interceptor to detect HTML returned by SPA fallback when backend is unconfigured or unreachable
api.interceptors.response.use(
  (response) => {
    // Check if the response returned an HTML document (SPA rewrite fallback) instead of JSON
    const isHtml =
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!DOCTYPE') ||
        response.data.trim().startsWith('<html') ||
        (response.headers['content-type'] && response.headers['content-type'].includes('text/html')));

    if (isHtml) {
      const err = new Error(
        'Backend API could not be reached (received HTML instead of JSON). Verify VITE_API_URL in your deployment settings.'
      );
      err.isHtmlFallback = true;
      err.response = response;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = 'Connection timed out. The backend service may be waking up or offline.';
    }
    return Promise.reject(error);
  }
);

export default api;
