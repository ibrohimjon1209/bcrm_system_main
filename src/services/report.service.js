import api from './api';

/**
 * @typedef {import('../types/api.types').DashboardStats} DashboardStats
 */

const reportService = {
  /**
   * Get dashboard statistics
   * @param {string} period - today | 7kun | oylik | yillik
   * @returns {Promise<DashboardStats>}
   */
  getDashboardStats: async (period = 'today') => {
    const response = await api.get('/api/reports/dashboard/', { params: { period } });
    return response.data;
  },

  /**
   * Get profit report
   * @param {string} date_from - YYYY-MM-DD
   * @param {string} date_to - YYYY-MM-DD
   * @returns {Promise<Object>}
   */
  getProfitReport: async (date_from, date_to) => {
    const response = await api.get('/api/reports/profit/', { params: { date_from, date_to } });
    return response.data;
  },

  /**
   * Get warehouse report
   * @returns {Promise<Object>}
   */
  getWarehouseReport: async () => {
    const response = await api.get('/api/reports/warehouse/');
    return response.data;
  }
};

export default reportService;
