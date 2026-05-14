import api from './api';

const reportsService = {
  /**
   * Get dashboard statistics
   * @param {string} period - today | 7kun | oylik | yillik
   * @returns {Promise}
   */
  getDashboardStats: async (period = 'today') => {
    const response = await api.get('/api/reports/dashboard/', {
      params: { period }
    });
    return response.data;
  },

  /**
   * Get profit report
   * @param {string} dateFrom - YYYY-MM-DD
   * @param {string} dateTo - YYYY-MM-DD
   * @returns {Promise}
   */
  getProfitReport: async (dateFrom, dateTo) => {
    const response = await api.get('/api/reports/profit/', {
      params: {
        date_from: dateFrom,
        date_to: dateTo
      }
    });
    return response.data;
  },

  /**
   * Get warehouse status report
   * @returns {Promise}
   */
  getWarehouseReport: async () => {
    const response = await api.get('/api/reports/warehouse/');
    return response.data;
  }
};

export default reportsService;
