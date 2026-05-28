import axios from 'axios';

// Create a globally configured Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // CRITICAL: This tells the browser to automatically attach our HTTP-Only cookies to every request!
  withCredentials: true,
});

// Since we use HTTP-Only cookies, we NO LONGER NEED the LocalStorage interceptor.
// The browser handles token passing securely and automatically!
