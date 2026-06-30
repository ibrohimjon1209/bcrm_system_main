import api from './api';

const customerService = {
  getCustomers: async (params) => {
    const { companyId, ...restParams } = params || {};
    const url = companyId ? `/api/companies/${companyId}/customers/` : '/api/customers/';
    const response = await api.get(url, { params: restParams });
    return response.data;
  },

  createCustomer: async (data) => {
    const response = await api.post('/api/customers/', data);
    return response.data;
  },

  getCustomer: async (id) => {
    const response = await api.get(`/api/customers/${id}/`);
    return response.data;
  },

  updateCustomer: async (id, data) => {
    const response = await api.patch(`/api/customers/${id}/`, data);
    return response.data;
  },

  deleteCustomer: async (id) => {
    await api.delete(`/api/customers/${id}/`);
  },

  getDebtors: async (companyId) => {
    const url = companyId ? `/api/companies/${companyId}/customers/debtors/` : '/api/customers/debtors/';
    const response = await api.get(url);
    return response.data;
  },

  // Uses GET /api/sales/?customer={id} — actual sales list endpoint
  getCustomerSalesHistory: async (id) => {
    const response = await api.get('/api/sales/', { params: { customer: id } });
    return response.data;
  },

  getVipCustomers: async (companyId) => {
    const url = companyId ? `/api/companies/${companyId}/customers/vip/` : '/api/customers/vip/';
    const response = await api.get(url);
    return response.data;
  },

  getBotLink: async (id) => {
    const response = await api.get(`/api/customers/${id}/bot-link/`);
    return response.data;
  },

  payDebt: async (id, data) => {
    const response = await api.post(`/api/customers/${id}/pay-debt/`, data);
    return response.data;
  },

  sendDebtReminder: async (id) => {
    const response = await api.post(`/api/customers/${id}/send-debt-reminder/`, {});
    return response.data;
  },

  unlinkTelegram: async (id) => {
    const response = await api.post(`/api/customers/${id}/unlink/`, {});
    return response.data;
  },

  linkByPhone: async (data) => {
    const response = await api.post('/api/customers/link-by-phone/', data);
    return response.data;
  },

  linkByToken: async (data) => {
    const response = await api.post('/api/customers/link-by-token/', data);
    return response.data;
  },

  getCustomerByChatId: async (chatId) => {
    const response = await api.get(`/api/customers/by-chat-id/${chatId}/`);
    return response.data;
  },
};

export default customerService;
