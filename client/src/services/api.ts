import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access denied:', data?.message || 'You do not have permission to perform this action');
          break;
        case 404:
          console.error('Resource not found:', data?.message || 'The requested resource was not found');
          break;
        case 500:
          console.error('Server error:', data?.message || 'An unexpected server error occurred');
          break;
        default:
          console.error('API error:', data?.message || error.message);
      }
      
      return Promise.reject({
        message: data?.message || error.message,
        code: data?.code,
        status,
        details: data?.details,
      });
    } else if (error.request) {
      console.error('Network error: No response received from server');
      return Promise.reject({
        message: 'Network error: Unable to connect to server',
        code: 'NETWORK_ERROR',
      });
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: 'Request setup error',
        code: 'REQUEST_ERROR',
        details: error.message,
      });
    }
  }
);

// Suppliers
export const supplierService = {
  getAll: () => api.get('/suppliers'),
  getById: (id: string) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post('/suppliers', data),
  update: (id: string, data: any) => api.put(`/suppliers/${id}`, data),
  delete: (id: string) => api.delete(`/suppliers/${id}`),
};

// Products
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Orders
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  addItem: (orderId: string, data: any) => api.post(`/orders/${orderId}/items`, data),
};

// Analytics
export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getOrderStats: () => api.get('/analytics/orders'),
  getTopSuppliers: () => api.get('/analytics/suppliers'),
  getProductCategories: () => api.get('/analytics/categories'),
};

export default api;
