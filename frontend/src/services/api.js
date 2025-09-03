import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const emailAPI = {
  // Connect to IMAP
  connectIMAP: (credentials) => api.post('/email/imap/connect', credentials),
  
  // Disconnect from IMAP
  disconnectIMAP: () => api.post('/email/imap/disconnect'),
  
  // Analyze emails
  analyzeEmails: (filters) => api.post('/email/analyze', filters),
  
  // Get analysis results
  getAnalysisResults: (params) => api.get('/email/results', { params }),
};

export default api;