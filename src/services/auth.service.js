import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) await api.post('/api/auth/logout/', { refresh });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me/');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/api/auth/me/', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post('/api/auth/change-password/', data);
    return response.data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    const response = await api.post('/api/auth/token/refresh/', { refresh });
    if (response.data.access) localStorage.setItem('access_token', response.data.access);
    return response.data;
  },
};

export default authService;
