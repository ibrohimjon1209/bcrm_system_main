import api from './api';

const companyService = {
  // Super Admin
  getCompanies: (params) => api.get('/api/companies/', { params }).then(r => r.data),
  getCompany: (id) => api.get(`/api/companies/${id}/`).then(r => r.data),
  createCompany: (data) => api.post('/api/companies/', data).then(r => r.data),
  updateCompany: (id, data) => api.patch(`/api/companies/${id}/`, data).then(r => r.data),
  deleteCompany: (id) => api.delete(`/api/companies/${id}/`).then(r => r.data),
  toggleActive: (id) => api.post(`/api/companies/${id}/toggle-active/`, {}).then(r => r.data),
  loginAs: (id) => api.post(`/api/companies/${id}/login-as/`, {}).then(r => r.data),
  getCompanyStats: (id) => api.get(`/api/companies/${id}/stats/`).then(r => r.data),
  getCompanySettings: (id) => api.get(`/api/companies/${id}/settings/`).then(r => r.data),
  updateCompanySettings: (id, data) => api.patch(`/api/companies/${id}/settings/`, data).then(r => r.data),

  // Own company (owner/admin)
  getMyCompany: () => api.get('/api/companies/me/').then(r => r.data),
  updateMyCompany: (data) => {
    const formData = data instanceof FormData ? data : (() => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v); });
      return fd;
    })();
    return api.patch('/api/companies/me/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
  getMySettings: () => api.get('/api/companies/me/settings/').then(r => r.data),
  updateMySettings: (data) => {
    const formData = data instanceof FormData ? data : (() => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v); });
      return fd;
    })();
    return api.patch('/api/companies/me/settings/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  // Company-scoped endpoints (for super admin viewing specific company data)
  getCompanyProducts: (id, params) => api.get(`/api/companies/${id}/products/`, { params }).then(r => r.data),
  getCompanyCategories: (id, params) => api.get(`/api/companies/${id}/categories/`, { params }).then(r => r.data),
  getCompanyCustomers: (id, params) => api.get(`/api/companies/${id}/customers/`, { params }).then(r => r.data),
  getCompanySales: (id, params) => api.get(`/api/companies/${id}/sales/`, { params }).then(r => r.data),
  getCompanyPurchases: (id, params) => api.get(`/api/companies/${id}/purchases/`, { params }).then(r => r.data),
  getCompanyUsers: (id, params) => api.get(`/api/companies/${id}/users/`, { params }).then(r => r.data),
  getCompanyNotifications: (id, params) => api.get(`/api/companies/${id}/notifications/`, { params }).then(r => r.data),
  getCompanyTickets: (id, params) => api.get(`/api/companies/${id}/tickets/`, { params }).then(r => r.data),
};

export default companyService;
