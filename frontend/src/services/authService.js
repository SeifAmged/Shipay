import api from './http';

const register = (username, email, password, firstName, lastName) => {
    return api.post('auth/register/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
    });
};

const login = async (username, password) => {
    try {
        const response = await api.post('auth/login/', { username, password });
        return response;  // Return response so AuthContext can read response.data.access
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