import api from './api';

const auditService = {
  getLogs: (params) => api.get('/api/audit/', { params }).then(r => r.data),
  getStats: () => api.get('/api/audit/stats/').then(r => r.data),
};

export default auditService;
