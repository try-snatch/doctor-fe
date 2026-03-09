import axios from 'axios';
import { Capacitor } from '@capacitor/core';

/**
 * API Configuration
 *
 * This module configures axios to work in both web and native (iOS/Android) environments.
 *
 * - Web (dev): Uses relative URLs, proxied by Vite to http://127.0.0.1:8000
 * - Web (prod): Uses relative URLs, proxied by Nginx to backend
 * - Native (Capacitor): Uses absolute URL to reach the backend server
 */

// Determine the API base URL based on the platform
const getApiBaseUrl = () => {
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();

  console.log('🔧 API Configuration:');
  console.log('  Platform:', platform);
  console.log('  Is Native:', isNative);
  console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL);

  if (isNative) {
    // For iOS Simulator, use your Mac's local IP or production server
    // Option 1: Production server (works anywhere)
    // return 'http://65.0.132.181:8000';

    // Option 2: Local development - use your Mac's IP address
    // Find your Mac's IP: System Settings > Network > Wi-Fi > Details > TCP/IP
    // Example: return 'http://192.168.1.100:8000';

    // Option 3: For iOS simulator, localhost from Mac maps to 127.0.0.1
    // But you need to use Mac's actual IP for the simulator to reach it

    // For now, let's use an environment variable or default to production
    const apiUrl = import.meta.env.VITE_API_URL || 'http://65.0.132.181:8000';
    console.log('  🎯 Using API URL:', apiUrl);
    return apiUrl;
  }

  // For web, use relative URLs (proxied in dev by Vite, same-domain in prod)
  console.log('  🎯 Using relative URLs');
  return '';
};

// Configure axios defaults
axios.defaults.baseURL = getApiBaseUrl();
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the full URL being requested
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    console.log('📡 API Request:', config.method?.toUpperCase(), fullUrl);

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Token refresh state — prevents concurrent refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

// Add response interceptor for token refresh
axios.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url, error.message);
    const originalRequest = error.config;

    // Don't try to refresh if not a 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Auth endpoints that return 401 for invalid credentials — don't redirect/refresh
    // BUT /api/auth/me/ is a protected endpoint that NEEDS token refresh
    const authUrl = error.config?.url || '';
    const noRefreshEndpoints = [
      '/api/auth/request-otp/',
      '/api/auth/register/',
      '/api/auth/verify-otp/',
      '/api/auth/verify-email/',
      '/api/auth/verify-invitation/',
      '/api/auth/staff/setup-account/',
      '/api/auth/forgot-password/',
      '/api/auth/reset-password/',
      '/api/auth/resend-email-verification/',
      '/api/auth/resend-registration-otp/',
    ];
    if (noRefreshEndpoints.some(ep => authUrl.includes(ep))) {
      return Promise.reject(error);
    }

    // Don't retry if already retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      // No refresh token — go to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // If already refreshing, queue this request to retry after refresh completes
    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // Use a plain axios instance to avoid interceptor loop
      const response = await axios.create().post(
        (axios.defaults.baseURL || '') + '/api/auth/token/refresh/',
        { refresh: refreshToken }
      );

      const { access, refresh: newRefresh } = response.data;
      localStorage.setItem('access_token', access);
      if (newRefresh) {
        localStorage.setItem('refresh_token', newRefresh);
      }

      isRefreshing = false;
      onRefreshed(access);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${access}`;
      return axios(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      refreshSubscribers = [];
      // Refresh failed, clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

// API instance to use throughout the app
export const api = axios;

// Helper to get full URL (useful for debugging)
export const getFullUrl = (path) => {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
};

// Export platform info for conditional logic
export const isPlatformNative = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform(); // 'ios', 'android', or 'web'
