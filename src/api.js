import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getTasks = (params = {}) => api.get('/tasks/assigned', { params }); // Add params
export const getTask = (id) => api.get(`/tasks/${id}`);
export const updateStatus = (id, status) => api.put(`/tasks/${id}/status`, { status });
export const createTask = (data) => api.post('/tasks', data);
export const editTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const setDependency = (data) => api.post('/tasks/dependency', data);
export const searchTasks = (params) => api.get('/tasks/search', { params });
export const getUsers = () => api.get('/users');
export const changeRole = (id, role) => api.put(`/users/${id}/role`, { role });
export const getProgress = () => api.get('/users/progress');
export const getReport = (type, id) => api.get('/reports/progress', { params: { type, id } });
export const downloadPDF = (type, id) => api.get('/reports/pdf', { params: { type, id }, responseType: 'blob' });
export const downloadCSV = (type, id) => api.get('/reports/csv', { params: { type, id }, responseType: 'blob' });
// 
export const getNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.put(`/notifications/${id}/read`);