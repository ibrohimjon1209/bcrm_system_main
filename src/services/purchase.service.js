import api from './api';

/**
 * @typedef {import('../types/api.types').Purchase} Purchase
 * @typedef {import('../types/api.types').Supplier} Supplier
 * @typedef {import('../types/api.types').PaginatedResponse} PaginatedResponse
 */

const purchaseService = {
  /**
   * Get list of purchases
   * @param {Object} params - { supplier, payment_method, date_from, date_to, ordering, page }
   * @returns {Promise<PaginatedResponse<Purchase>>}
   */
  getPurchases: async (params) => {
    const response = await api.get('/api/purchases/', { params });
    return response.data;
  },

  /**
   * Create a new purchase
   * @param {Object} data - { supplier, items, payment_method, note }
   * @returns {Promise<Purchase>}
   */
  createPurchase: async (data) => {
    const response = await api.post('/api/purchases/', data);
    return response.data;
  },

  /**
   * Get purchase detail
   * @param {number} id
   * @returns {Promise<Purchase>}
   */
  getPurchase: async (id) => {
    const response = await api.get(`/api/purchases/${id}/`);
    return response.data;
  },

  /**
   * Update purchase
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Purchase>}
   */
  updatePurchase: async (id, data) => {
    const response = await api.patch(`/api/purchases/${id}/`, data);
    return response.data;
  },

  /**
   * Delete purchase
   * @param {number} id
   */
  deletePurchase: async (id) => {
    await api.delete(`/api/purchases/${id}/`);
  },

  /**
   * Get list of suppliers
   * @param {Object} params - { search, page }
   * @returns {Promise<PaginatedResponse<Supplier>>}
   */
  getSuppliers: async (params) => {
    const response = await api.get('/api/purchases/suppliers/', { params });
    return response.data;
  },

  /**
   * Create a new supplier
   * @param {Object} data
   * @returns {Promise<Supplier>}
   */
  createSupplier: async (data) => {
    const response = await api.post('/api/purchases/suppliers/', data);
    return response.data;
  },

  /**
   * Update supplier
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Supplier>}
   */
  updateSupplier: async (id, data) => {
    const response = await api.patch(`/api/purchases/suppliers/${id}/`, data);
    return response.data;
  },

  /**
   * Get single supplier
   * @param {number} id
   * @returns {Promise<Supplier>}
   */
  getSupplier: async (id) => {
    const response = await api.get(`/api/purchases/suppliers/${id}/`);
    return response.data;
  },

  /**
   * Delete supplier
   * @param {number} id
   */
  deleteSupplier: async (id) => {
    await api.delete(`/api/purchases/suppliers/${id}/`);
  }
};

export default purchaseService;
