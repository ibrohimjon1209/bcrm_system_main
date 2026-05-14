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
   * Get VIP customers
   * @returns {Promise<Customer[]>}
   */
  getVipCustomers: async () => {
    const response = await api.get('/api/customers/vip/');
    return response.data;
  }
};

export default customerService;
