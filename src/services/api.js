import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Rides
export const ridesAPI = {
  create: (data) => api.post('/rides', data),
  getMyRides: () => api.get('/rides/my-rides'),
  getActiveRide: () => api.get('/rides/active'),
  getDriverRides: () => api.get('/rides/driver-rides'),
  getAllRides: (status) => api.get('/rides/all', { params: { status } }),
  start: (id) => api.patch(`/rides/${id}/start`),
  complete: (id) => api.patch(`/rides/${id}/complete`),
  rate: (id, data) => api.patch(`/rides/${id}/rate`, data),
  cancel: (id) => api.patch(`/rides/${id}/cancel`),
  acceptPrice: (id) => api.post(`/rides/${id}/accept-price`),
  rejectPrice: (id) => api.post(`/rides/${id}/reject-price`)
};

// Drivers
export const driversAPI = {
  getProfile: () => api.get('/drivers/profile'),
  updateAvailability: (availability) => api.patch('/drivers/availability', { availability }),
  getPendingRides: () => api.get('/drivers/pending-rides'),
  getActiveRide: () => api.get('/drivers/active-ride'),
  acceptRide: (rideId) => api.post(`/drivers/accept-ride/${rideId}`),
  rejectRide: (rideId) => api.post(`/drivers/reject-ride/${rideId}`),
  getPayments: () => api.get('/drivers/payments'),
  getStats: () => api.get('/drivers/stats')
};

// Admin
export const adminAPI = {
  createDriver: (data) => api.post('/admin/drivers', data),
  getDrivers: () => api.get('/admin/drivers'),
  updateDriver: (id, data) => api.patch(`/admin/drivers/${id}`, data),
  deleteDriver: (id) => api.delete(`/admin/drivers/${id}`),
  getRides: () => api.get('/admin/rides'),
  getStats: () => api.get('/admin/stats'),
  getPayments: () => api.get('/admin/payments'),
  confirmPayment: (id) => api.patch(`/admin/payments/${id}/confirm`),
  getStatistics: (period) => api.get('/admin/statistics', { params: { period } }),
  setPrice: (id, price) => api.post(`/admin/rides/${id}/set-price`, { price }),
  assignDriver: (id, driver_id, estimated_arrival_time) => api.post(`/admin/rides/${id}/assign-driver`, { driver_id, estimated_arrival_time }),
  getUsers: () => api.get('/admin/users')
};

// Users
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  changePassword: (data) => api.patch('/users/password', data),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (id) => api.patch(`/users/notifications/${id}/read`)
};

export default api;
