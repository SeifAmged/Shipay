/**
 * Authentication context for managing user authentication state.
 * 
 * Provides authentication functionality including:
 * - User login/logout operations
 * - JWT token management and refresh
 * - Automatic token validation on app load
 * - 401 error handling and automatic logout
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';
import { setOnUnauthorized } from '../services/http';

const AuthContext = createContext(null);

/**
 * Authentication provider component.
 * 
 * Manages global authentication state and provides authentication
 * methods to child components through React context.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        const tokenInStorage = localStorage.getItem('token');
        const refreshTokenInStorage = localStorage.getItem('refreshToken');
        
        if (tokenInStorage) {
            try {
                const decoded = jwtDecode(tokenInStorage);
                if (decoded.exp * 1000 < Date.now()) {
                    // Token expired, attempt refresh
                    if (refreshTokenInStorage) {
                        refreshAccessToken();
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                    }
                } else {
                    // Token is valid, set user state
                    setUser({ username: decoded.username, id: decoded.user_id });
                    setToken(tokenInStorage);
                    setRefreshToken(refreshTokenInStorage);
                }
            } catch {
                // Invalid token, clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            }
        }
        
        // Register global 401 error handler
        setOnUnauthorized(() => {
            setUser(null);
            setToken(null);
            setRefreshToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        });
    }, []);

    /**
     * Refreshes the access token using the stored refresh token.
     * 
     * @returns {Promise<string>} The new access token
     * @throws {Error} When refresh fails or no refresh token available
     */
    const refreshAccessToken = async () => {
        try {
            const refreshTokenInStorage = localStorage.getItem('refreshToken');
            if (!refreshTokenInStorage) {
                throw new Error('No refresh token available');
            }

            const response = await authService.refreshToken(refreshTokenInStorage);
            if (response && response.data && response.data.access) {
                const newToken = response.data.access;
                const newRefreshToken = response.data.refresh;
                
                localStorage.setItem('token', newToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                
                const decoded = jwtDecode(newToken);
                setUser({ username: decoded.username, id: decoded.user_id });
                setToken(newToken);
                setRefreshToken(newRefreshToken);
                
                return newToken;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            setUser(null);
            setToken(null);
            setRefreshToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            throw error;
        }
    };

    /**
     * Authenticates user with username and password.
     * 
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object>} Login response data
     * @throws {Error} When login fails
     */
    const login = async (username, password) => {
        const response = await authService.login(username, password);
        if (response && response.data && response.data.access) {
            const new_token = response.data.access;
            const new_refresh_token = response.data.refresh;
            const decoded = jwtDecode(new_token);
            
            localStorage.setItem('token', new_token);
            localStorage.setItem('refreshToken', new_refresh_token);
            
            setUser({ username: decoded.username, id: decoded.user_id });
            setToken(new_token);
            setRefreshToken(new_refresh_token);
            return response;
        } else {
            throw new Error('Invalid login response.');
        }
    };

    /**
     * Logs out the current user and clears all authentication data.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        setRefreshToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to access authentication context.
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} When used outside of AuthProvider
 */
export const useAuth = () => {
    return useContext(AuthContext);
};