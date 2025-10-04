/**
 * Authentication service for user registration, login, and token management.
 * 
 * Provides API methods for:
 * - User registration with validation
 * - User authentication with error handling
 * - JWT token refresh functionality
 * - Consistent error message formatting
 */

import api from './http';

/**
 * Registers a new user account.
 * 
 * @param {string} username - User's chosen username
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {Promise<Object>} Registration response
 */
const register = (username, email, password, firstName, lastName) => {
    return api.post('auth/register/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
    });
};

/**
 * Authenticates user with username and password.
 * 
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Login response with JWT tokens
 * @throws {Error} When authentication fails or account is locked
 */
const login = async (username, password) => {
    try {
        const response = await api.post('auth/login/', { username, password });
        return response;
    } catch (error) {
        let message = 'Login failed. Please check credentials.';
        if (error.response && error.response.data && error.response.data.detail) {
            message = error.response.data.detail;
        } else if (error.response && error.response.status === 403) {
            message = 'Account is locked due to too many failed login attempts. Please try again later.';
        } else if (error.message) {
            message = error.message;
        }
        throw new Error(message);
    }
};

/**
 * Refreshes JWT access token using refresh token.
 * 
 * @param {string} refresh - Refresh token
 * @returns {Promise<Object>} Token refresh response
 * @throws {Error} When token refresh fails
 */
const refreshToken = async (refresh) => {
    try {
        const response = await api.post('auth/refresh/', { refresh });
        return response;
    } catch (error) {
        let message = 'Token refresh failed. Please login again.';
        if (error.response && error.response.data && error.response.data.detail) {
            message = error.response.data.detail;
        } else if (error.message) {
            message = error.message;
        }
        throw new Error(message);
    }
};

const authService = {
    register,
    login,
    refreshToken,
};

export default authService;