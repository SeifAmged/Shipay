/**
 * HTTP client configuration for API communication.
 * 
 * Provides Axios instance with:
 * - Automatic JWT token attachment to requests
 * - Token refresh on 401 errors
 * - Request queuing during token refresh
 * - Global error handling for authentication failures
 */

import axios from 'axios';

const baseURL = (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://127.0.0.1:8000/api/';

// Global state for token refresh management
let onUnauthorizedHandler = null;
let isRefreshing = false;
let failedQueue = [];

/**
 * Processes queued requests after token refresh completes.
 * 
 * @param {Error|null} error - Error if refresh failed, null if successful
 * @param {string|null} token - New token if refresh successful, null if failed
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

/**
 * Sets the global handler for unauthorized (401) responses.
 * 
 * @param {Function} handler - Function to call when 401 error occurs
 */
export const setOnUnauthorized = (handler) => {
    onUnauthorizedHandler = handler;
};

// Create Axios instance with base configuration
export const api = axios.create({ baseURL });

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue request while token refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    // Dynamic import to avoid circular dependency
                    const { default: authService } = await import('./authService');
                    const response = await authService.refreshToken(refreshToken);
                    const newToken = response.data.access;
                    const newRefreshToken = response.data.refresh;
                    
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    
                    processQueue(null, newToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error('No refresh token available');
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                if (onUnauthorizedHandler) {
                    try { onUnauthorizedHandler(); } catch { /* noop */ }
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;

