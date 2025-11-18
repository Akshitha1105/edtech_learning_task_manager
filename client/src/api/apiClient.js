import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('edtech_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // ignore parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
