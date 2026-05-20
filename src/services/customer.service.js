import api from './api';

/**
 * @typedef {import('../types/api.types').Customer} Customer
 * @typedef {import('../types/api.types').CustomerList} CustomerList
 * @typedef {import('../types/api.types').PaginatedResponse} PaginatedResponse
 */

const customerService = {
  /**
   * Get list of customers
   * @param {Object} params - { search, status, ordering, page }
   * @returns {Promise<PaginatedResponse<CustomerList>>}
   */
  getCustomers: async (params) => {
    const response = await api.get('/api/customers/', { params });
    return response.data;
  },

  /**
   * Create a new customer
   * @param {Object} data
   * @returns {Promise<Customer>}
   */
  createCustomer: async (data) => {
    const response = await api.post('/api/customers/', data);
    return response.data;
  },

  /**
   * Get customer detail
   * @param {number} id
   * @returns {Promise<Customer>}
   */
  getCustomer: async (id) => {
    const response = await api.get(`/api/customers/${id}/`);
    return response.data;
  },

  /**
   * Update customer
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Customer>}
   */
  updateCustomer: async (id, data) => {
    const response = await api.patch(`/api/customers/${id}/`, data);
    return response.data;
  },

  /**
   * Delete customer
   * @param {number} id
   */
  deleteCustomer: async (id) => {
    await api.delete(`/api/customers/${id}/`);
  },

  /**
   * Get debtors
   * @returns {Promise<Customer[]>}
   */
  getDebtors: async () => {
    const response = await api.get('/api/customers/debtors/');
    return response.data;
  },

  /**
   * Get sales history for a customer
   * @param {number} id
   * @returns {Promise<any[]>}
   */
  getCustomerSalesHistory: async (id) => {
    const response = await api.get(`/api/customers/${id}/sales-history/`);
    return response.data;
  },

  /**
   * Get VIP customers
   * @returns {Promise<Customer[]>}
   */
  getVipCustomers: async () => {
    const response = await api.get('/api/customers/vip/');
    return response.data;
  },

  /**
   * Get Telegram bot link for customer
   * @param {number} id
   * @returns {Promise<Customer>}
   */
  getBotLink: async (id) => {
    const response = await api.get(`/api/customers/${id}/bot-link/`);
    return response.data;
  },

  /**
   * Pay customer debt
   * @param {number} id
   * @param {Object} data - { amount }
   * @returns {Promise<Customer>}
   */
  payDebt: async (id, data) => {
    const response = await api.post(`/api/customers/${id}/pay-debt/`, data);
    return response.data;
  },

  /**
   * Send debt reminder to customer via Telegram
   * @param {number} id
   * @returns {Promise}
   */
  sendDebtReminder: async (id) => {
    const response = await api.post(`/api/customers/${id}/send-debt-reminder/`);
    return response.data;
  },

  /**
   * Send custom message to customer
   * @param {number} id
   * @param {Object} data - { text }
   * @returns {Promise<any>}
   */
  sendMessage: async (id, data) => {
    const response = await api.post(`/api/customers/${id}/send-message/`, data);
    return response.data;
  },

  /**
   * Get message history
   * @param {number} id
   * @returns {Promise<any[]>}
   */
  getMessageHistory: async (id) => {
    const response = await api.get(`/api/customers/${id}/message-history/`);
    return response.data;
  },

  /**
   * Unlink customer from Telegram
   * @param {number} id
   * @returns {Promise<Customer>}
   */
  unlinkTelegram: async (id) => {
    const response = await api.post(`/api/customers/${id}/unlink/`);
    return response.data;
  },

  /**
   * Link customer by phone number
   * @param {Object} data - { phone }
   * @returns {Promise<Customer>}
   */
  linkByPhone: async (data) => {
    const response = await api.post('/api/customers/link-by-phone/', data);
    return response.data;
  },

  /**
   * Link customer by token
   * @param {Object} data - { token }
   * @returns {Promise<Customer>}
   */
  linkByToken: async (data) => {
    const response = await api.post('/api/customers/link-by-token/', data);
    return response.data;
  },

  /**
   * Get customer by Telegram chat_id
   * @param {string} chatId
   * @returns {Promise<Customer>}
   */
  getCustomerByChatId: async (chatId) => {
    const response = await api.get(`/api/customers/by-chat-id/${chatId}/`);
    return response.data;
  },
};

export default customerService;
