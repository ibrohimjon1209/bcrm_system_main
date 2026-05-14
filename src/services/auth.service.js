import api from './api';

const authService = {
  /**
   * Login with phone and password
   * @param {Object} credentials - { phone, password }
   * @returns {Promise} - Resolves with { access, refresh, user }
   */
  login: async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logout and clear tokens
   * @returns {Promise}
   */
  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) {
        await api.post('/api/auth/logout/', { refresh });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user information
   * @returns {Promise} - Resolves with user data
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me/');
    return response.data;
  },

  /**
   * Refresh the access token manually
   * @returns {Promise} - Resolves with { access, refresh }
   */
  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    const response = await api.post('/api/auth/refresh/', { refresh });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    return response.data;
  },
};

export default authService;
