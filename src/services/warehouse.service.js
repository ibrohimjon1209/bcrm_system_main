import api from './api';

const warehouseService = {
  // Products
  getProducts: async (params) => {
    const response = await api.get('/api/products/', { params });
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await api.get(`/api/products/${id}/`);
    return response.data;
  },
  
  createProduct: async (productData) => {
    const response = await api.post('/api/products/', productData);
    return response.data;
  },
  
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/products/${id}/`, productData);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/products/${id}/`);
    return response.data;
  },
  
  getLowStockProducts: async () => {
    const response = await api.get('/api/products/low_stock/');
    return response.data;
  },

  // Categories
  getCategories: async (params) => {
    const response = await api.get('/api/products/categories/', { params });
    return response.data;
  },
  
  getCategory: async (id) => {
    const response = await api.get(`/api/products/categories/${id}/`);
    return response.data;
  },
  
  createCategory: async (categoryData) => {
    const response = await api.post('/api/products/categories/', categoryData);
    return response.data;
  },
  
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/api/products/categories/${id}/`, categoryData);
    return response.data;
  },
  
  deleteCategory: async (id) => {
    const response = await api.delete(`/api/products/categories/${id}/`);
    return response.data;
  }
};

export default warehouseService;
