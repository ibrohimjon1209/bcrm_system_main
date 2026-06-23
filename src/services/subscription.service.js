import api from './api';

const subscriptionService = {
  // Super Admin
  getAll: (params) => api.get('/api/subscriptions/', { params }).then(r => r.data),
  getOne: (id) => api.get(`/api/subscriptions/${id}/`).then(r => r.data),
  create: (data) => api.post('/api/subscriptions/', data).then(r => r.data),
  update: (id, data) => api.patch(`/api/subscriptions/${id}/`, data).then(r => r.data),
  delete: (id) => api.delete(`/api/subscriptions/${id}/`).then(r => r.data),
  block: (id) => api.post(`/api/subscriptions/${id}/block/`, {}).then(r => r.data),
  extend: (id, data) => api.post(`/api/subscriptions/${id}/extend/`, data).then(r => r.data),

  // Own company
  getMine: () => api.get('/api/subscriptions/me/').then(r => r.data),
  getTariffs: () => api.get('/api/tariffs/').then(r => r.data),
};

export default subscriptionService;
