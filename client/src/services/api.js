import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (formData) => {
  return api.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Add interceptor to handle tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Profile update endpoints
export const updateProfile = async (userId, userData) => {
  try {
    console.log('Sending update request:', { userId, userData });
    const response = await api.put(`/auth/update-profile/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log('Update response:', response.data);
    return response;
  } catch (error) {
    console.error('Profile update error:', error.response?.data || error);
    throw error;
  }
};

export const updateProfilePhoto = async (userId, formData) => {
  try {
    const response = await api.put(`/auth/update-profile-photo/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Photo upload error:', error);
    throw error;
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await api.post('/announcements/create', announcementData);
    return response;
  } catch (error) {
    console.error('Create announcement error:', error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    const response = await api.get('/announcements');
    return response;
  } catch (error) {
    console.error('Get announcements error:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await api.delete(`/announcements/${id}`);
    return response;
  } catch (error) {
    console.error('Delete announcement error:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response;
  } catch (error) {
    console.error('Update announcement error:', error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services/create', serviceData);
    return response;
  } catch (error) {
    console.error('Create service error:', error);
    throw error;
  }
};

export const getUserServices = async (userId) => {
  try {
    const response = await api.get(`/services/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Get user services error:', error);
    throw error;
  }
};

export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await api.put(`/services/${serviceId}`, serviceData);
    return response;
  } catch (error) {
    console.error('Update service error:', error);
    throw error;
  }
};

export const deleteService = async (serviceId) => {
  try {
    const response = await api.delete(`/services/${serviceId}`);
    return response;
  } catch (error) {
    console.error('Delete service error:', error);
    throw error;
  }
};

export const getAllServices = async (filters = {}) => {
  try {
    const response = await api.get('/services/all', { params: filters });
    return response;
  } catch (error) {
    console.error('Get all services error:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/services/book', bookingData);
    return response;
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await api.get(`/services/bookings/${userId}`);
    return response;
  } catch (error) {
    console.error('Get user bookings error:', error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const formData = new FormData();
    Object.keys(transactionData).forEach(key => {
      formData.append(key, transactionData[key]);
    });

    const response = await api.post('/transactions/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};

export const getUserTransactions = async (userId) => {
  try {
    const response = await api.get(`/transactions/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Get user transactions error:', error);
    throw error;
  }
};

export const updateTransactionStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/services/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};

export const getUserFeedback = async (userId) => {
  try {
    console.log('Fetching feedback for user:', userId);
    const response = await api.get(`/services/user-feedback/${userId}`);
    console.log('Feedback response:', response.data);
    return response;
  } catch (error) {
    console.error('Get user feedback error:', error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/services/feedback', feedbackData);
    return response;
  } catch (error) {
    console.error('Submit feedback error:', error);
    throw error;
  }
};

export const getWalletBalance = async (userId) => {
  try {
    const response = await api.get(`/services/wallet/${userId}`);
    return response;
  } catch (error) {
    console.error('Get wallet balance error:', error);
    throw error;
  }
};

export const transferFunds = async (transferData) => {
  try {
    const response = await api.post('/services/wallet/transfer', transferData);
    return response;
  } catch (error) {
    console.error('Transfer funds error:', error);
    throw error;
  }
};

// Add new endpoint to get user data
export const getUserData = async (userId) => {
  try {
    const response = await api.get(`/auth/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
};

export default api;
