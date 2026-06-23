import api from './api';

const notificationService = {
  getNotifications: () => api.get('/api/notifications/').then(r => r.data),
  getUnreadCount: () => api.get('/api/notifications/unread-count/').then(r => r.data),
  markRead: (id) => api.post(`/api/notifications/${id}/read/`).then(r => r.data),
  markAllRead: () => api.post('/api/notifications/mark-all-read/').then(r => r.data),
};

export default notificationService;
