import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Interceptor to add JWT Authorization header if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arvix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for standard error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Complaint Services
export const complaintService = {
  lodgeComplaint: (formData) =>
    api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  trackComplaint: (trackingId) => api.get(`/complaints/track/${trackingId}`),
  getAllComplaints: (params) => api.get('/complaints', { params }),
  getStats: () => api.get('/complaints/stats'),
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
};

// Government Schemes Services
export const schemeService = {
  getAll: (params) => api.get('/schemes', { params }),
  getById: (id) => api.get(`/schemes/${id}`),
  create: (data) => api.post('/schemes', data),
};

// Community / Marriage Hall Services
export const hallService = {
  getCalendar: (params) => api.get('/hall-bookings/calendar', { params }),
  bookHall: (data) => api.post('/hall-bookings', data),
  getAllBookings: () => api.get('/hall-bookings'),
  updateStatus: (id, data) => api.patch(`/hall-bookings/${id}/status`, data),
};

// Schedules (Free Medicine & Free Ration)
export const scheduleService = {
  getMedicineSchedule: () => api.get('/schedules/medicine'),
  updateMedicineSchedule: (data) => api.put('/schedules/medicine', data),
  getRationSchedule: () => api.get('/schedules/ration'),
  updateRationSchedule: (data) => api.put('/schedules/ration', data),
};

// Announcements
export const announcementService = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export default api;
