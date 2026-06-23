import api from './api';

const userService = {
  getUsers: () => api.get('/api/users/').then(r => r.data),
  getUser: (id) => api.get(`/api/users/${id}/`).then(r => r.data),
  createUser: (data) => api.post('/api/users/', data).then(r => r.data),
  updateUser: (id, data) => api.patch(`/api/users/${id}/`, data).then(r => r.data),
  deleteUser: (id) => api.delete(`/api/users/${id}/`).then(r => r.data),
};

export default userService;
