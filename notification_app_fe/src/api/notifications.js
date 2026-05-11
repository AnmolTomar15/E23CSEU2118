import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5050/api',
});

// Since users are pre-authenticated, we assume the Bearer token exists.
// We can mock it here just to satisfy the backend auth requirement.
api.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer mock-frontend-token';
  return config;
});

export const getNotifications = async (params) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const getPriorityNotifications = async (n) => {
  const response = await api.get('/notifications/priority', { params: { n } });
  return response.data;
};
