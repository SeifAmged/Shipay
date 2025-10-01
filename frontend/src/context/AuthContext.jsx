/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';
import { setOnUnauthorized } from '../services/http';

const AuthContext = createContext(null);

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
                    // Token expired, try to refresh
                    if (refreshTokenInStorage) {
                        refreshAccessToken();
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                    }
                } else {
                    setUser({ username: decoded.username, id: decoded.user_id });
                    setToken(tokenInStorage);
                    setRefreshToken(refreshTokenInStorage);
                }
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            }
        }
        
        // register 401 handler once
        setOnUnauthorized(() => {
            setUser(null);
            setToken(null);
            setRefreshToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        });
    }, []);

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

export const useAuth = () => {
    return useContext(AuthContext);
};