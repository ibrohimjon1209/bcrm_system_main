import api from './api';

const supportService = {
  getTickets: (params) => api.get('/api/support/', { params }).then(r => r.data),
  getTicket: (id) => api.get(`/api/support/${id}/`).then(r => r.data),
  createTicket: (data) => api.post('/api/support/', data).then(r => r.data),
  updateTicket: (id, data) => api.patch(`/api/support/${id}/`, data).then(r => r.data),
  deleteTicket: (id) => api.delete(`/api/support/${id}/`).then(r => r.data),
  addMessage: (id, body) => api.post(`/api/support/${id}/messages/`, { body }).then(r => r.data),
};

export default supportService;
