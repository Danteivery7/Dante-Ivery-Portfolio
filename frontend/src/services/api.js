import axios from 'axios';

const rawApiUrl = (process.env.REACT_APP_BACKEND_URL || '').trim();
const API_URL = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

// Auth
export const login = (username, password) => 
  api.post('/api/auth/login', { username, password });

// Content
export const getAllContent = () => api.get('/api/content');
export const getContent = (contentId) => api.get(`/api/content/${contentId}`);
export const updateContent = (contentId, value) => 
  api.put(`/api/content/${contentId}`, { value });

// Portfolio
export const getPortfolio = () => api.get('/api/portfolio');
export const createProject = (project) => api.post('/api/portfolio', project);
export const updateProject = (projectId, project) => 
  api.put(`/api/portfolio/${projectId}`, project);
export const deleteProject = (projectId) => api.delete(`/api/portfolio/${projectId}`);

// Contact
export const submitContactForm = (data) => api.post('/api/contact', data);

// Initialize content (for first time setup)
export const initializeContent = () => api.post('/api/init-content');

export default api;
